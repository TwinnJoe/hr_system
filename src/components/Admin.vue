<template>
  <div class="app-container">
    <!-- Welcome View -->
    <div v-if="!showLogin" class="card">
      <h1 class="title">HR System</h1>
      <p class="description">Streamline HR Processes</p>
      <div class="button-group">
        <button class="btn btn-admin" @click="showLogin = true">Administrator</button>
      </div>
      <p class="footer">© 2024 HR Management System. All rights reserved.</p>
    </div>

    <!-- Admin Login View -->
    <div v-else class="login-container">
      <p class="logins">Username:Admin | Password:Admin1 </p>
      <form @submit.prevent="validateLogin">
        <h2 class="title">Administrator</h2>
        <div class="input-group">
          <input
            type="text"
            v-model="username"
            placeholder="Username"
            autocomplete="username"
            required
          />
        </div>
        <div class="input-group">
          <input
            type="password"
            v-model="password"
            placeholder="Password"
            autocomplete="current-password"
            required
          />
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" class="login-button">Login</button>
        <a href="#" class="forgot-password">Forgot Password?</a>
      </form>

      <!-- Success Modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h2>Success</h2>
          <p>Login Successful!</p>
          <div class="tick-icon">&#10003;</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapMutations } from 'vuex';
const API = import.meta.env.VITE_API_URL;

export default {
  name: "AdminComp",
  data() {
    return {
      showLogin: false,
      username: "",
      password: "",
      errorMessage: "", 
      showModal: false,
    };
  },
  methods: {
    ...mapMutations(['setToken', 'setUser']),
    switchToAdmin() {
      
      this.$router.push({ path: "/admin" });
    },
    async validateLogin() {
      try {
        const response = await axios.post(`${API}admin/login`, {
          username: this.username,
          password: this.password,
        });

        if (response.data.token) {
           this.errorMessage = '';
          // If the login is successful, store the token in localStorage and Vuex
          localStorage.setItem('token', response.data.token);
          this.setToken(response.data.token);
          this.setUser(response.data.user);

          this.showModal = true; // Show success modal

          // Redirect after delay
          setTimeout(() => {
            this.$router.push("/dashboard");
          }, 2000);
        }else {
      // If for some reason token missing, set generic error
      this.errorMessage = 'Login failed: no token received.';
    }
      } catch (error) {
        this.errorMessage = error.response?.data?.error || "Invalid username or password. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
/* ===========================
   Layout Containers & General
=========================== */
.app-container,
.login-container {
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 1rem;
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  inset: 0;
}

/* ===========================
   Card Layout
=========================== */
.card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

/* ===========================
   Typography
=========================== */
.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333333;
  margin-bottom: 1rem;
}

.description,.logins {
  font-size: 1rem;
  color: #666666;
  margin-bottom: 1.5rem;
}

.footer {
  font-size: 0.875rem;
  color: #666666;
}

/* ===========================
   Buttons
=========================== */
.button-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.btn {
  padding: 0.5rem 1rem;
  min-width: 8rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-admin {
  background-color: #4169e1;
  color: #ffffff;
}

/* ===========================
   Login Form
=========================== */
form {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 300px;
  max-width: 400px;
  z-index: 1;
}

.input-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #4169e1;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.login-button:hover {
  background-color: #2f66f6;
}

.forgot-password {
  display: block;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-bottom: 15px;
}

/* ===========================
   Modal (Centered Notification)
=========================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.modal {
  position: fixed;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 250px;
  height: 150px;
}

.modal h2 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  color: #333;
}

.modal p {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #555;
}

.tick-icon {
  font-size: 3rem;
  color: #59e8a6;
  margin-top: 1rem;
}

/* ===========================
   Media Queries
=========================== */
@media (max-width: 480px) {
  .title {
    font-size: 1rem;
  }

  .description {
    font-size: 0.9rem;
  }

  .card {
    max-width: 80%;
    padding: 1rem;
  }

  .input-group {
    margin-bottom: 10px;
  }
  .button-group {
    flex-direction: column;
    align-items: center;
  }

  .button-group .btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .footer {
    font-size: 0.6rem;
  }

  form {
    max-width: 80%;
    padding: 1rem;
  }

  .login-button {
    font-size: 0.85rem;
    padding: 10px;
  }

  .forgot-password {
    font-size: 0.8rem;
  }

  .modal {
    width: 70%;
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 1.25rem;
  }

   .card {
    max-width: 80%;
    padding: 1.5rem;
  }

  .description {
    font-size: 0.9rem;
  }
  .forgot-password {
    font-size: 0.875rem;
  }

  .input-group {
    margin-bottom: 12px;
  }

  form {
    max-width: 90%;
    padding: 1.5rem;
  }

  .login-button {
    font-size: 0.9rem;
    padding: 12px;
  }

  .button-group {
    font-size: 0.9rem;
  }
}

</style>

