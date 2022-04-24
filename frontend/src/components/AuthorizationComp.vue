<template>
  <div class="jc-center">
    <b-card class="card-container" title="Вход в систему" v-if="!authorizated">
      <b-tabs content-class="mt-3">
        <b-tab title="Авторизация" active>
          <b-form @submit.stop.prevent="doLogin()">
            <label for="text-login">Логин</label>
            <b-form-input v-model="login" required></b-form-input>
          
            <label for="text-password">Пароль</label>
            <b-form-input type="password" v-model="password" required></b-form-input>

            <b-button type="submit" variant="primary" class="mt-3">Войти</b-button>
          </b-form>
        </b-tab>
        <b-tab title="Регистрация">
          <b-form @submit.stop.prevent>
            <label>Имя</label>
            <b-form-input v-model="registration.name" :state="nameValid" required @focus="touched.name = true"></b-form-input>
            <p class="invalid" v-show="nameValid == false">
              Не менее 3 символов.
            </p>

            <label>Фамилия</label>
            <b-form-input v-model="registration.surname" :state="surnameValid" required  @focus="touched.surname = true"></b-form-input>
            <p class="invalid" v-show="surnameValid == false">
              Не менее 3 символов.
            </p>

            <label>Отчество</label>
            <b-form-input v-model="registration.fatherName" :state="fatherNameValid" required  @focus="touched.fatherName = true"></b-form-input>
            <p class="invalid" v-show="fatherNameValid == false">
              Не менее 3 символов.
            </p>

            <label>Должность</label>
            <b-form-input v-model="registration.position" :state="positionValid" required  @focus="touched.position = true"></b-form-input>
            <p class="invalid" v-show="positionValid == false">
              Не менее 3 символов.
            </p>

            <label >Логин</label>
            <b-form-input v-model="registration.login" :state="loginValid" required  @focus="touched.login = true"></b-form-input>
            <p class="invalid" v-show="loginValid == false">
              Не менее 4 символов.
            </p>
            
            <label>Пароль</label>
            <b-form-input type="password" v-model="registration.password1" :state="password1Valid" @focus="touched.password1 = true" required></b-form-input>
            <p class="invalid" v-show="password1Valid == false">
              Не менее 4 символов.
            </p>

            <label>Повторите пароль</label>
            <b-form-input type="password" v-model="registration.password2" :state="password2Valid" @focus="touched.password2 = true" required></b-form-input>
            <p class="invalid" v-show="password2Valid == false">
              Пароли не совпадают
            </p>
            <b-button type="submit" variant="primary" class="mt-3">Зарегистрироваться</b-button>
          </b-form>

        </b-tab>
      </b-tabs>
    </b-card>
    <b-card
      v-else
      no-body
      style="width: 600px;"
    >
      <template #header>
        <h4 class="mb-0">Профиль</h4>
        <b-button size="sm" variant="dark" class="logout-btn" @click="doLogout()">
          Выйти
        </b-button>
      </template>
      <b-card-body>
        <b-list-group flush>
          <b-list-group-item>
            <b-row no-gutters>
              <b-col md="6">Имя</b-col>
              <b-col md="6">123</b-col>
            </b-row>
          </b-list-group-item>
          <b-list-group-item>
            <b-row no-gutters>
              <b-col md="6">Фамилия</b-col>
              <b-col md="6">123</b-col>
            </b-row>
           </b-list-group-item>
          <b-list-group-item>
            <b-row no-gutters>
              <b-col md="6">Отчество</b-col>
              <b-col md="6">123</b-col>
            </b-row>
          </b-list-group-item>
          <b-list-group-item>
            <b-row no-gutters>
              <b-col md="6">Должность</b-col>
              <b-col md="6">123</b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "AuthorizationComp",
  props: {
    authorizated: Boolean
  },
  data: () => ({
    login: '',
    password: '',
    registration: {
      name: '',
      surname: '',
      fatherName: '',
      position: '',
      login: '',
      password1: '',
      password2: ''
    },
    touched: {
      name: false,
      surname: false,
      fatherName: false,
      position: false,
      login: false,
      password1: false,
      password2: false
    }
  }),
  computed: {
    nameValid() {
      return !this.touched.name ? null : this.registration.name.length > 2
    },
    surnameValid() {
      return !this.touched.surname ? null : this.registration.surname.length > 2
    },
    fatherNameValid() {
      return !this.touched.fatherName ? null : this.registration.fatherName.length > 2
    },
    positionValid() {
      return !this.touched.position ? null : this.registration.position.length > 2
    },
    loginValid() {
      return !this.touched.login ? null : this.registration.login.length > 3
    },
    password1Valid() {
      return !this.touched.password1 ? null : this.registration.password1.length > 3
    },
    password2Valid() {
      return !this.touched.password2 ? null : (this.registration.password1 == this.registration.password2 && this.password1Valid)
    }
  },
  methods: {
    doLogin() {
      console.log(123);
      this.$emit('doLogin')
    },
    doLogout() {
      this.$emit('doLogout')
    }
  }
}
</script>

<style scoped>
.jc-center {
  display: flex;
  justify-content: center;
}

p .invalid {
  font-size: 11px;
  color: red;
  margin: 0;
  padding: 3px 0 0 0;
  height: 15px;
}
.logout-btn {
  position: absolute;
  top: 7px;
  right: 5px;
}
</style>