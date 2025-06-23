<template>
  <aside :class="['navbar', { 'navbar-hidden': !navVisible }]">
    <h1 class="brand">HR System</h1>

    <ul>
      <li>
        <router-link class="nav-link" to="/dashboard" active-class="active-link">
          <i class="bx bx-home-alt"></i>
          <span class="link-text">Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link class="nav-link" to="/finance" active-class="active-link">
          <i class="bx bx-money"></i>
          <span class="link-text">Finance</span>
        </router-link>
      </li>
      <li>
        <router-link class="nav-link" to="/request" active-class="active-link">
          <i class="bx bx-group"></i>
          <span class="link-text">Employees</span>
        </router-link>
      </li>
      <li>
        <router-link class="nav-link logout-link" to="/" active-class="active-link">
          <i class="bx bx-log-out"></i>
          <span class="link-text">Logout</span>
        </router-link>
      </li>
    </ul>
  </aside>

  <!-- Toggle button -->
  <button 
    class="nav-toggle" 
    aria-label="Toggle navigation" 
    @click="toggleNav" 
    :aria-expanded="navVisible.toString()"
  >
    <svg v-if="!navVisible" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>

  <!-- Overlay -->
  <transition name="fade">
    <div v-if="navVisible" class="overlay" @click="closeNav" aria-hidden="true"></div>
  </transition>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      navVisible: false,
    };
  },
  methods: {
    toggleNav() {
      this.navVisible = !this.navVisible;
    },
    closeNav() {
      this.navVisible = false;
    },
    handleKeydown(e) {
      if (e.key === "Escape" && this.navVisible) {
        this.closeNav();
      }
    },
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
};
</script>

<style scoped>
/* Sidebar (navbar) styles */
.navbar {
  display: flex;
  flex-direction: column;
  background-color: #4169e1;
  padding: 1.5rem 1.25rem;
  min-width: 240px;
  font-weight: 500;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100vh;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  padding: 12px 14px;
  border-radius: 6px;
  transition: all 0.25s ease;
  font-size: 0.95rem;
}

.nav-link:hover {
  background-color: #222;
  color: #fff;
  transform: translateX(2px);
}

.nav-link.active-link {
  background-color: #333;
  color: #fff;
  font-weight: 600;
}

.nav-link i {
  font-size: 1.1rem;
}

.link-text {
  display: inline;
}

.logout-link:hover {
  background-color: rgba(255, 0, 0, 0.1) !important;
  color: #ff6b6b;
}

.logout-link:hover i {
  color: #ff6b6b;
}

.navbar-hidden {
  transform: translateX(-100%);
  visibility: hidden;
  pointer-events: none;
}

/* Brand */
.navbar .brand {
  font-size: 1.75rem;
  color: #fff;
  font-weight: 700;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
  user-select: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Nav list */
.navbar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Toggle button styles */
.nav-toggle {
  position: fixed;
  top: 1rem;
  left: 1rem;
  background: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #fff;
  padding: 0.5rem;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav-toggle:hover,
.nav-toggle:focus {
  background: #444;
  color: #ff6b6b;
  transform: scale(1.05);
  outline: none;
}

.nav-toggle svg {
  width: 24px;
  height: 24px;
}

/* Overlay to dim content when nav open */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 90;
  backdrop-filter: blur(2px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .navbar {
    width: 260px;
    padding-top: 4rem;
  }
  
  .nav-link:hover {
    background-color: #333;
    color: #fff;
    transform: translateX(5px);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.5);
  }
  .nav-toggle {
    display: block;
  }
}

@media (min-width: 1024px) {
  .navbar {
    position: sticky;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: auto;
    width: 100%;
    padding: 1rem 2rem;
    transform: none !important; /* Force override */
    visibility: visible !important; /* Force override */
    pointer-events: auto !important; /* Ensure clickable */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .navbar ul {
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 0;
  }

  .navbar .brand {
    margin-bottom: 0;
    margin-right: 2rem;
  }

  .nav-link {
    padding: 0.75rem 1rem;
  }

  .nav-link:hover {
    background-color: #444;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .link-text {
    display: inline;
  }

  .nav-toggle {
    display: none;
  }

  .overlay {
    display: none;
  }

  .navbar-hidden {
    transform: none !important;
    visibility: visible !important;
  }
}
</style>