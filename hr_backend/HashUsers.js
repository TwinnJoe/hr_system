// hashUsers.js
import bcrypt from 'bcryptjs';

const users = [
  { adminId: 1, username: 'Admin', password: 'Admin1' },
  { adminId: 2, username: 'Manager', password: 'Manager1' }
];

const hashPasswords = async () => {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10); // 10 is the salt rounds
    console.log(
      `(${user.adminId}, '${user.username}', '${hashedPassword}'),`
    );
  }
};

hashPasswords();
