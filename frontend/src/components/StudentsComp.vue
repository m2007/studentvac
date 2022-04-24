<template>
  <b-col class="cont">
    <b-row>
      <b-col >
        <div class="info-field">
          <div>Выберите учебную организацию:</div>
          <b-form-select class="select-location" v-model="selectedUni" :options="getAllUnis"></b-form-select>
        </div>
        <div class="info-field">
          <b-form-input class="input-new-data mr-5" v-model="newUniName" required></b-form-input>
          <b-button size="sm">Добавить уч. организацию</b-button>
        </div>
      </b-col>
      <b-col v-show="selectedUni">
        <div class="info-field">
          <div>Выберите группу:</div>
          <b-form-select class="select-location" v-model="selectedGroup" :options="getAllGroups"></b-form-select>
        </div>
        <div class="info-field">
          <b-form-input class="input-new-data mr-5" v-model="newGroupName" required></b-form-input>
          <b-button size="sm">Добавить группу в уч. организацию</b-button>
        </div>
      </b-col>
    </b-row>
    <hr>
    <b-row v-if="isUniGroupSelected">
      <b-col>
        <div class="info-field">
          Поиск студента: <b-form-input class="input-new-data" v-model="FIOSearch"></b-form-input>
        </div>
        <b-form-group label="Сортировка по прививкам" v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            v-model="typeVactinations"
            :aria-describedby="ariaDescribedby"
            id="radio-filter"
          >
            <b-form-radio value="first">Без фильтра</b-form-radio>
            <b-form-radio value="second">Показать студентов без просроченной датой</b-form-radio>
            <b-form-radio value="third">Показать студентов с просроченной датой</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
          
        <b-table striped hover :items="getStudents" :fields="getFieldsWithAllVactinations">
          <template #cell(-)="data">
            <b-button size="sm" @click="setCard(data.item._id)">
              Развернуть
            </b-button>
          </template>
        </b-table>
        <student-card v-if="!!card && !!selectedStudID" :card_prop.sync="card" :selectedStudID_prop="selectedStudID"
        @close="selectedStudID=null"></student-card>
        <b-button size="sm" variant="outline-primary" @click="addNewStudent()">
          Добавить студента
        </b-button>
      </b-col>
    </b-row>
  </b-col>
  
</template>

<script>
export default {
  name: "StudentsComp",
  components: {
    StudentCard: () => import('@/components/StudentCard.vue')
  },
  computed: {
    getAllUnis() {
      let unis = []
      this.unis.forEach(u => unis.push({value: u.name, text: u.name}))
      return unis
    },
    getAllGroups() {
      if (!this.selectedUni) return []
      let grps = []
      let uni = this.unis.find(u => u.name == this.selectedUni)
      uni.groups.forEach(gr => grps.push({value: gr.name, text: gr.name}))
      return grps
    },
    isUniGroupSelected() {
      return !!this.selectedUni && !!this.selectedGroup
    },
    getFieldsWithAllVactinations() {
      if (!this.isUniGroupSelected) return []
      let vacs = []
      for (let uni of this.unis) {
        if (uni.name == this.selectedUni) {
          for (let gr of uni.groups) {
            if (gr.name == this.selectedGroup) {

              gr.students.forEach(st => {
                st.vactinations.forEach(v => {
                  if (!vacs.includes(v.name)) vacs.push(v.name)
                })
              })
              break
            }
          }
        }
      }
      return [{key:'ФИО',sortable: true}, ...vacs, '-']
    },
    getStudents() {
      if (!this.isUniGroupSelected) return []
      let displayStudents = []
      for (let uni of this.unis) {
        if (uni.name == this.selectedUni) {
          for (let gr of uni.groups) {
            if (gr.name == this.selectedGroup) {

              gr.students.forEach(st => {
                let vacs = []
                let expiredCells = null
                st.vactinations.forEach(v => {
                  const isExpired = new Date(v.expires).getTime() - new Date().getTime() < 0
                  vacs.push({
                    [v.name]: `${v.date}${v.expires != '' ? " до " + v.expires : ''} ${v.otherNotes}`
                  })
                  if (isExpired) {
                    if (expiredCells == null) expiredCells = {}
                    expiredCells = Object.assign(expiredCells, {[v.name]: "danger"})
                  }
                })
                
                displayStudents.push(Object.assign(
                  {
                    _id: st._id,
                    "ФИО": `${st.surname} ${st.name} ${st.fatherName}`
                  },
                  {
                    _cellVariants: expiredCells
                  },
                  ...vacs
                  )
                )
                
              })
              if (this.typeVactinations == "first") {
                return displayStudents.filter(st => st["ФИО"].includes(this.FIOSearch))
              }
              else if (this.typeVactinations == "second") {
                return displayStudents.filter(st => !st._cellVariants)
              }
              else return displayStudents.filter(st => !!st._cellVariants)
            }
          }
        }
      }
      return []
    },
    selectedStud() {
      if (this.selectedStudID == null) return undefined
      for (let uni of this.$data.unis) {
        if (uni.name == this.selectedUni) {
          for (let gr of uni.groups) {
            if (gr.name == this.selectedGroup) {
              for (let st of gr.students) {
                if (st._id == this.selectedStudID) {
                  return Object.assign(st, {groupName: gr.name}, {uniName: uni.name})
                }
              }
            }
          }
        }
      }
      return undefined
    }
  },
  methods: {
    setCard(id) {
      this.selectedStudID = id
      if (this.selectedStudID == null) return
      let vac = []
      this.selectedStud.vactinations.forEach(v => {
        vac.push({
          name: v.name,
          date: v.date,
          expires: v.expires,
          otherNotes: v.otherNotes
        })
      })
      this.card = {
        _id: this.selectedStudID,
        name: this.selectedStud.name,
        surname: this.selectedStud.surname,
        fatherName: this.selectedStud.fatherName,
        vactinations: vac,
        groupName: this.selectedGroup,
        uniName: this.selectedUni
      }
      console.log(this.card);
    },
    clearCard() {
      this.card = null
    },
    addNewStudent() {
      this.selectedStudID = 'new'
      this.card = {
        _id: this.selectedStudID,
        name: '',
        surname: '',
        fatherName: '',
        vactinations: [],
        groupName: this.selectedGroup,
        uniName: this.selectedUni
      }
    }
  },
  watch: {
    selectedUni() {
      this.selectedGroup = null
      this.selectedStudID = null
      this.clearCard()
    },
    selectedGroup() {
      this.selectedStudID = null
      this.clearCard()
    }
  },
  data: () => ({
    newUniName: '',
    newGroupName: '',
    selectedUni: null,
    selectedGroup: null,
    selectedStudID: null,
    card: null,

    typeVactinations: "first",
    FIOSearch: '',
    unis: [
      {
        name: "ИТМО",
        groups: [
          {
            name: "3443",
            students: [
              {
                _id: Math.random(),
                name: 'Иван',
                surname: 'Иванов',
                fatherName: 'Иванович',
                vactinations: [
                  {
                    name: 'ФЛГ',
                    date: '123',
                    expires: '2022-04-23',
                    otherNotes: 'прошла успешна'
                  },
                  {
                    name: 'Ковид',
                    date: '123',
                    expires: '2022-04-22',
                    otherNotes: 'неуспешна'
                  }
                ]
              },
              {
                _id: Math.random(),
                name: 'Степан',
                surname: 'Иванов',
                fatherName: 'Иванович',
                vactinations: [
                  {
                    name: 'ФЛГ',
                    date: '2022-04-22',
                    expires: '',
                    otherNotes: ''
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "ЛЭТИ",
        groups: [
          {
            name: "7374",
            students: [
              {
                _id: Math.random(),
                name: 'Иван',
                surname: 'Иванов',
                fatherName: 'Иванович',
                vactinations: [
                  {
                    name: 'в кори',
                    date: '123',
                    expires: '2022-04-26',
                    otherNotes: 'прошла успешна'
                  },
                  {
                    name: 'рв кори',
                    date: '123',
                    expires: '2022-04-22',
                    otherNotes: 'неуспешна'
                  }
                ]
              },
              {
                _id: Math.random(),
                name: 'Иван',
                surname: 'Иванов',
                fatherName: 'Иванович1',
                vactinations: [
                  {
                    name: 'ФЛГ',
                    date: '',
                    expires: '2022-04-22',
                    otherNotes: 'тест'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  })
}
</script>

<style>
.cont {
  margin: 5px 20px;
}
.info-field {
  display: flex;
  flex-direction: row;
}
.info-field select {
  margin: 0 5px 5px;
}
.select-location {
  height: 30px;
  width: 150px;
}
.input-new-data {
  height: 30px;
  width: 150px;
}
.sr-only {
  display: none;
}
#radio-filter {
  display: flex;
  justify-content: space-between;
}
.mr-5 {
  margin-right: 5px;
}
</style>