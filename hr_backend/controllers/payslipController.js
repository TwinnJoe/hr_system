import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

export const sendPayslip = async (req, res) => {
  const { name, email, payslip } = req.body;

  if (!email || !payslip)
    return res.status(400).json({ message: "Missing email or payslip data" });

  // Currency formatter
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount);

  try {
    // 1. Create PDF in memory
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      // 2. Setup email transport
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      // 3. Send email with PDF attachment
      await transporter.sendMail({
        from: `"HR System" <${process.env.MAIL_USER}>`,
        to: email,
        subject: `Payslip for ${name}`,
        text: `Hi ${name},\n\nPlease find attached your payslip.`,
        attachments: [
          {
            filename: `Payslip_${name.replace(/\s+/g, '_')}.pdf`,
            content: pdfData,
            contentType: 'application/pdf',
          },
        ],
      });

      res.json({ message: "Payslip PDF sent successfully" });
    });

    // 4. Generate PDF Content
    doc.fontSize(20).text(`Payslip for ${name}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);

    const dataRows = [
      ['Salary', formatCurrency(payslip.baseSalary)],
      ['Overtime', formatCurrency(payslip.overtimePay)],
      ['Bonus', formatCurrency(payslip.performanceBonus)],
      ['Gross', formatCurrency(payslip.grossSalary)],
      ['Deductions', `${payslip.leaveDeductions}%`],
      ['Net', formatCurrency(payslip.netSalary)],
      ['Annual', formatCurrency(payslip.annualSalary)],
    ];

    dataRows.forEach(([label, value]) => {
      doc.text(`${label}:`, { continued: true }).text(` ${value}`);
    });

    doc.moveDown().text('This is your official payslip. Please contact HR for any queries.', {
      align: 'left',
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending payslip email with PDF' });
  }
};
