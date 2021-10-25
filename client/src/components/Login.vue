<template>
  <!--<b-row class="justify-content-md-center">-->
    <!--<b-col cols="6">-->
  <div class="container login-container">

    <div v-if="errors && errors.length">
      <div v-for="error of errors">
        <b-alert show>{{error.message}}</b-alert>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 login-form-2">
        <h1>
          <div class="animated fadeInLeft">DBW </div>
          <div class="animated fadeInRight">Feed Aggregator</div>
        </h1>
        <b-form @submit="onSubmit">
          <div class="form-group" label="Enter Username">
            <b-form-input id="username" :state="state" placeholder="Your Username *" v-model.trim="login.username"></b-form-input>
          </div>
          <div class="form-group" label="Enter Password">
            <b-form-input type="password" placeholder="Your Password *" id="password" :state="state" v-model.trim="login.password"></b-form-input>
          </div>
          <b-button type="submit" variant="primary">Login</b-button>
          <b-button type="button" variant="success" @click.stop="register()">Register</b-button>
        </b-form>
      </div>
      <!--</b-col>
    </b-row>-->
      </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      login: {},
      errors: []
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      axios.post(`http://localhost:8081/api/auth/login/`, this.login)
        .then(response => {
          localStorage.setItem('jwtToken', response.data.token)
          this.$router.push({
            name: 'Feeds'
          })
        })
        .catch(e => {
          console.log(e)
          this.errors.push(e)
        })
    },
    register () {
      this.$router.push({
        name: 'Register'
      })
    }
  }
}
</script>
<style>
  .login-container {
    margin-top: 5%;
    margin-bottom: 5%;
  }

  .login-form-2 {
    padding: 5%;
    background: #0062cc;
    box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 9px 26px 0 rgba(0, 0, 0, 0.19);
  }

    .login-form-2 h3 {
      text-align: center;
      color: #fff;
    }

  .login-container form {
    padding: 10%;
  }
  h1 {
    margin-top: 5%;
    font-size: 3rem;
    display: inline-block;
  }
  html, body {
    height: 100%;
    font-family: 'Varela Round' sans-serif;
    text-align: center;
  }
    h1 div {
      position: relative;
      float: left;
    }

      h1 div:first-child {
        color: #3498db;
        margin-right: 1rem;
      }

</style>
