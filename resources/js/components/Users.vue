<template>
<div class="container">
  <div class="row mt-5" v-if="$gate.isAdminOrAuthor()">
    <div class="col-md 12">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Users list</h3>

          <div class="card-tools">
            <button
              class="btn btn-success"
              @click="newModal"
              data-backdrop="static"
              data-keyboard="false"
            >
              Add New
              <i class="fas fa-user-plus fa-fw"></i>
            </button>
          </div>
        </div>
        <!-- /.card-header -->
        <div class="card-body table-responsive p-0">
          <table class="table table-hover">
            <tbody>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Registered</th>
                <th>Modify</th>
              </tr>

              <tr v-for="user in users.data" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.type|capitalize }}</td>
                <td>{{ user.created_at|formatDate }}</td>
                <td>
                  <a href @click.prevent="editModal(user)">
                    <i class="fa fa-edit color-blue"></i>
                  </a>
                  /
                  <a href @click.prevent="deleteUser(user.id)">
                    <i class="fa fa-trash color-red"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- /.card-body -->
        <div class="card-footer">
          <pagination :data="users"
          @pagination-change-page="getResults"></pagination>
        </div>
      </div>
      <!-- /.card -->
    </div>
</div>
        <div v-if="!$gate.isAdminOrAuthor()">
            <not-found></not-found>
        </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="addNew"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addNewLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-show="editmode" class="modal-title" id="addNewLabel">Update user's info</h5>
            <h5 v-show="!editmode" class="modal-title" id="addNewLabel">Add New</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <form
            @submit.prevent="editmode ? updateUser() : createUser()"
            @keydown="form.onKeydown($event)"
          >
            <div class="modal-body">
              <div class="form-group">
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  placeholder="Name"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('name') }"
                >
                <has-error :form="form" field="name"></has-error>
              </div>

              <div class="form-group">
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('email') }"
                >
                <has-error :form="form" field="email"></has-error>
              </div>

              <div class="form-group">
                <textarea
                  v-model="form.bio"
                  name="bio"
                  id="bio"
                  placeholder="Short bio for user (Optional)"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('bio') }"
                ></textarea>
                <has-error :form="form" field="bio"></has-error>
              </div>

              <div class="form-group">
                <select
                  name="type"
                  v-model="form.type"
                  id="type"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('type') }"
                >
                  <option value>Select User Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">Standard User</option>
                  <option value="author">Author</option>
                </select>
                <has-error :form="form" field="type"></has-error>
              </div>

              <div class="form-group">
                <input
                  v-model="form.password"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('password') }"
                >
                <has-error :form="form" field="password"></has-error>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
              <button v-show="editmode" type="submit" class="btn btn-success">Update</button>
              <button v-show="!editmode" type="submit" class="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- /.modal -->
 
</div>
</template>

<script>
export default {
  data() {
    return {
      editmode: false,
      users: {},
      // Create a new form instance vform => variable form (peut être un autre nom)
      form: new Form({
        id: "",
        name: "",
        email: "",
        password: "",
        type: "",
        bio: "",
        photo: ""
      })
    };
  },

  methods: {
    newModal() {
      (this.editmode = false), this.form.reset(); //champs //form renvoie à vform
      this.form.clear(); //erreurs
      $("#addNew").modal("show");
    },

    editModal(user) {
      (this.editmode = true), this.form.reset(); //champs
      this.form.clear(); //erreurs
      this.form.fill(user); //population data
      $("#addNew").modal("show");
    },

		getResults(page = 1) {
			axios.get('api/users?page=' + page)
				.then(response => {
					this.users = response.data;
				});
		},

    loadUsers() {
      if (this.$gate.isAdminOrAuthor()){
      axios.get("api/users").then(({ data }) => (this.users = data));
      }
    },

    createUser() {
      this.$Progress.start();
      this.form
        .post("api/users")
        .then(() => {
          Fire.$emit("after-cud"); //we recommend you always use kebab-case for event names
          $("#addNew").modal("hide");
          toast.fire({
            type: "success",
            title: "User Created in successfully"
          });
          this.$Progress.finish();
        })
        .catch(() => {
          this.$Progress.fail();
        });
    },

    updateUser() {
      // console.log("editing");
      this.$Progress.start();
      this.form
        .put("api/users/"+ this.form.id)
        .then(() => {
          Fire.$emit("after-cud"); //we recommend you always use kebab-case for event names
          $("#addNew").modal("hide");
          toast.fire({
            type: "success",
            title: "User successfully updated"
          });
          this.$Progress.finish();
        })
        .catch(() => {
          this.$Progress.fail();
        });
    },

    deleteUser(id) {
      swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
          if (result.value) {
            this.form
              .delete("api/users/" + id)
              .then(() => {
                Fire.$emit("after-cud");
                swal.fire("Deleted!", "Your file has been deleted.", "success");
                Fire.$emit('after-cud');
              })

              .catch(() => {
                this.$Progress.fail();
                swal.fire("Failed!", "There was something wrong.", "warning");
              });
          }
        });
    }
  }, //fin  method

  created() {
    Fire.$on("searching", ()=> {
        let query = this.$parent.search;//car la var est dans app.js le composant parent
        axios.get('api/findUser?q='+ query)
        .then((data)=> {
          this.users = data.data
        })
        .catch(()=> {


        })
    })

    this.loadUsers();

    Fire.$on("after-cud", () => {
      this.loadUsers();
    });
  }
};
</script>
   