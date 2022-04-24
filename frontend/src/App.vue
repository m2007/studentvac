<template>
  <b-tabs content-class="mt-3">
    <b-tab title="Профиль" active><authorization-comp :authorizated="authorizated" @doLogout="doLogout()" @doLogin="doLogin()"></authorization-comp></b-tab>
    <b-tab title="Студенты" :disabled="!authorizated"><students-comp></students-comp></b-tab>
  </b-tabs>
</template>

<script>

export default {
  name: 'App',
  components: {
    AuthorizationComp: () => import('@/components/AuthorizationComp.vue'),
    StudentsComp: () => import('@/components/StudentsComp.vue')
  },
  data: () => ({
    authorizated: true
  }),
  methods: {
    doLogout() {
      this.authorizated = false
    },
    doLogin() {
      this.authorizated = true
    }
  }
}
</script>

<style>
#app {
  text-align: center;
}

.card-container {
  margin: 30px 0;
  width: 400px;
}
</style>
