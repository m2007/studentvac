<template>
  <b-alert :show="selectedStudID != null" class="student-card">
    <h4 class="alert-heading">Карточка студента</h4>
    <div class="info-field-card">
      Уч. заведение: <b-form-input class="input-new-data" disabled v-model="card.uniName"></b-form-input>
    </div>
    <div class="info-field-card">
      Группа: <b-form-input class="input-new-data" disabled v-model="card.groupName"></b-form-input>
    </div>
    <div class="info-field-card">
      Фамилия: <b-form-input class="input-new-data" v-model="card.name"></b-form-input>
    </div>
    <div class="info-field-card">
      Имя: <b-form-input class="input-new-data" v-model="card.surname"></b-form-input>
    </div>
    <div class="info-field-card">
      Отчество: <b-form-input class="input-new-data" v-model="card.fatherName"></b-form-input>
    </div>
    <h5>Прививки:</h5>
    <div v-for="(vac, i) in card.vactinations" :key="i" class="vac-wrap">
      <h6>Прививка {{i + 1}}</h6>
      <div class="info-field-card">
        Название: <b-form-input class="input-new-data" v-model="vac.name"></b-form-input>
      </div>
      <div class="info-field-card">
        Дата: <b-form-input class="input-new-data" v-model="vac.date"></b-form-input>
      </div>
      <div class="info-field-card">
        Дата окончания: <b-form-input class="input-new-data" v-model="vac.expires"></b-form-input>
      </div>
      <div class="info-field-card">
        Другие заметки: <b-form-input class="input-new-data" v-model="vac.otherNotes"></b-form-input>
      </div>
      <div class="d-flex justify-content-end">
        <b-button size="sm" variant="danger" @click="delVac(vac.name)">Убрать</b-button>
      </div>
    </div>
    <b-button size="sm" variant="success" @click="addVac()">Добавить прививку</b-button>
    
    <hr>
    <div class="student-card-btns">
      <div>
        <b-button size="sm" variant="success" class="mr-5" @click="saveCard()">
          Сохранить
        </b-button>
        <b-button size="sm" variant="danger">
          Удалить
        </b-button>
      </div>
      <div>
        <b-button size="sm" variant="outline-primary" @click="closeCard()">
          Отмена
        </b-button>
      </div>
    </div>   
  </b-alert>
</template>

<script>
export default {
  props: {
    card_prop: Object,
    selectedStudID_prop: Number || String
  },
  data() {
    return {
      card: this.card_prop,
      selectedStudID: this.selectedStudID_prop
    }
  },
  methods: {
    addVac() {
      this.card.vactinations.push({
        name: '',
        date: '',
        expires: '',
        otherNotes: ''
      })
    },
    delVac(name) {
      this.card.vactinations = this.card.vactinations.filter(v => v.name != name)
    },
    saveCard() {
      console.log(this.card);
    },
    closeCard() {
      this.$emit('close')
    }
  }
}
</script>

<style>
.student-card {
  background-color: #dcfdff;
  width: 500px;
  max-height: 600px;
  overflow-y: auto;
  position: absolute;
  left:50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: -5px 10px 20px 5px #1e1e1e;
}
.student-card-btns {
  display: flex;
  justify-content: space-between;
}
.info-field-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 2px 0;
}
.vac-wrap {
  background-color: #f3fffa;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
}
</style>