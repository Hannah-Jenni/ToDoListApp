<script>
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import TodoList from './components/Todo.vue';

export default {
  name: "App",
  components: {
    'to-do-list': TodoList
  },
  methods: {
    addTodo() {
      console.log('add to do called in parent')
      this.$refs.toDoListComponent.addTodo();
    }
  },
  mounted() {
    console.log('App vue is mounted')
  }
};
</script>
<style lang="scss">
  .heading {
    width: 100%;
    text-align: center;
    .navbar-brand {
      &.h1 {
        font-size: 35px
      }
    }
  }
  p {
    margin: 10px 0px;
    text-align: right;
    label {
      vertical-align: middle;
      margin-left: 5px;
    }
  }
</style>
<template>
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    </head>
    <body>
      <div>
        <div class="container">
          <nav class="navbar navbar-light bg-light">
            <div class="heading">
              <span class="navbar-brand mb-0 h1">To-do List</span>
            </div>
          </nav>
          <div>
            <p>
              <button type="button" class="btn btn-info" @click="addTodo">
                <img src="./assets/add_icon.svg" alt="image">
                <label>Add To-do</label>
              </button>
            </p>
            <to-do-list ref="toDoListComponent"></to-do-list>
          </div>
        </div>
      </div>
    </body>
  </html>
</template>