Vue.component('todo', {
    data: function () {
        return {
            todoList: [],
            todoItem: ""
        }
    },
    mounted() {
        this.ReadData();
    },
    methods: {
        GetMonth() {
            var d = new Date();
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return months[d.getMonth()] + " " + d.getFullYear();
        },
        GetDay() {
            var d = new Date();
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";

            var n = weekday[d.getDay()];
            return n + ", " + d.getDate();
        },
        ReadData() {
            if (typeof (Storage) !== "undefined") {
                this.todoList = localStorage.getItem("todo");
                if (this.todoList === null) {
                    this.todoList = [];
                } else {
                    var temp = [];
                    var counter = 0;
                    var check = " -ENDOFTASK- ,";
                    while(this.todoList.indexOf(" -ENDOFTASK- ,")!==-1){
                        var index = this.todoList.indexOf(" -ENDOFTASK- ,");
                        var string = this.todoList.substring(0,index);
                        temp.push(string);
                        this.todoList = this.todoList.substring(index+14,this.todoList.length);
                    }
                    index = this.todoList.indexOf(" -ENDOFTASK- ");
                    string = this.todoList.substring(0,index);    
                    temp.push(string);
                    this.todoList = temp;
                }
            } else {
                // document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
            }
        },
        WriteData() {
            if (this.todoItem && typeof (Storage) !== "undefined") {
                var temp = [];
                for(var i=0; i<this.todoList.length; i++){
                    temp[i] = this.todoList[i] +  ' -ENDOFTASK- ';
                }
                temp.push(this.todoItem + ' -ENDOFTASK- ');
                this.todoList.push(this.todoItem);
                localStorage.setItem("todo", temp);
                this.todoItem = undefined;
            }
        },
        ClearData(){
            localStorage.removeItem("todo");
            this.todoItem = [];
            location.reload(); 
        },
        Remove(index){
            this.todoList.splice(index,1);
            if (typeof (Storage) !== "undefined") {
                var temp = [];
                for(var i=0; i<this.todoList.length; i++){
                    temp[i] = this.todoList[i] +  ' -ENDOFTASK- ';
                }
                localStorage.setItem("todo", temp);
            }
        },
        alternate(index){
            if(index%2===0){
                return "text-white original";
            }
            else{
                return "text-white alternate";
            }
        }
    },

    template: `
        <div class="box is-scrollable">
            <h1 class="title">{{GetDay()}}</h1>
            <div class="columns">
                <div class="column is-10">
                    <h1 class="subtitle">{{GetMonth()}}</h1>
                </div>
                <div class="column has-text-right">
                    <button class="button is-dark is-small" @click="ClearData">Clear</button>
                </div>
            </div>
            <hr/>
            <div class="columns">
                <div class="column is-10">
                    <input class="input" placeholder="Click here to enter a task..."  v-model="todoItem"  @keydown.enter="WriteData"></input>
                </div>
                <div class="column">
                    <div class="control">
                        <button class="button is-dark" type="submit" @click="WriteData">+</button>
                    </div>
                </div>
            </div>
            <table class="table is-fullwidth">
                <thead>
                    <tr>
                        <th class="text-white">Stay Motivated</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in this.todoList" :key="index">
                        <th :class="alternate(index)">
                            <div class="columns">
                                <div class="column is-10"> 
                                    {{item}}
                                </div>
                                <div class="column has-text-right">
                                    <button class="button is-dark is-small" @click="Remove(index)"> x </button>
                                </div>
                        </th>
                        
                    <tr>
                </tbody>
            </table>
        
        </div>`
});

const app = new Vue({
    el: "#app",
    data: {
        query: ""
    },
    methods: {
        GoogleSearch() {
            window.location.replace("https://www.google.com/search?client=firefox-b-1-d&q=" + this.query);
        }
    },
    computed: {
        GenerateImage() {
            return "hero is-fullheight image" + Math.floor((Math.random() * 20) + 1);
        }
    },
    template: `
        <div>
            <section :class="GenerateImage">
                <div class="hero-head">
                    <div class="columns">
                        <div class="column"/>
                        <div class="column is-6 is-expanded">
                            <div class="field has-addons is-expanded">
                                <div class="control has-icons-left is-expanded">
                                    <input autocomplete="on" class="input is-medium" v-model="query" placeholder="Search" @keydown.enter="GoogleSearch">
                                        <span class="icon is-medium is-left">
                                            <i class="fa fa-google"></i>
                                        </span>
                                    </input>
                                </div>
                                <div class="control">
                                    <button class="button is-dark is-medium" type="submit" @click="GoogleSearch">Search</button>
                                </div>
                            </div>
                        </div>
                        <div class="column"/>
                    </div>
                </div>
   
                <div class="hero-foot">
                <todo> </todo>
                <a class="weatherwidget-io" href="https://forecast7.com/en/33d77n118d19/long-beach/?unit=us" data-label_1="LONG BEACH" data-label_2="WEATHER" data-theme="dark" >LONG BEACH WEATHER</a>
                </div>
            </section>  
        </div>
    `
});