Vue.component('todo', {
    data: function () {
        return {
            todoList: [],
            MessageList: [],
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
                    while (this.todoList.indexOf(" -ENDOFTASK- ,") !== -1) {
                        var index = this.todoList.indexOf(" -ENDOFTASK- ,");
                        var string = this.todoList.substring(0, index);
                        temp.push(string);
                        this.todoList = this.todoList.substring(index + 14, this.todoList.length);
                    }
                    index = this.todoList.indexOf(" -ENDOFTASK- ");
                    string = this.todoList.substring(0, index);
                    temp.push(string);
                    this.todoList = temp;
                    for (var i = 0; i < this.todoList.length; i++) {
                        var data = localStorage.getItem(i);
                        if (data !== null) {
                            this.MessageList.push(JSON.parse(data));
                        }
                    }


                }
            } else {
                // document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
            }
        },
        WriteData() {
            if (this.todoItem && typeof (Storage) !== "undefined") {
                var temp = [];
                for (var i = 0; i < this.todoList.length; i++) {
                    temp[i] = this.todoList[i] + ' -ENDOFTASK- ';
                }
                temp.push(this.todoItem + ' -ENDOFTASK- ');
                this.todoList.push(this.todoItem);
                localStorage.setItem("todo", temp);
                this.todoItem = undefined;
            }
        },
        ClearData() {
            localStorage.removeItem("todo");
            for (var i = 0; i < this.todoList.length; i++) {
                localStorage.removeItem(i);
            }
            this.todoItem = [];
            location.reload();

        },
        Remove(index) {
            this.todoList.splice(index, 1);
            if (typeof (Storage) !== "undefined") {
                var temp = [];
                for (var i = 0; i < this.todoList.length; i++) {
                    temp[i] = this.todoList[i] + ' -ENDOFTASK- ';
                }
                localStorage.setItem("todo", temp);
                localStorage.removeItem(index);
            }
        },
        AddNote(index) {
            var data = {
                id: index,
                x: 0,
                y: 0
            };
            if (!this.MessageList.some(e => e.id === index)) {
                this.MessageList.push(data);
                localStorage.setItem(index, JSON.stringify(data));
            }
        },
        RemoveSticky(id) {
            var index = this.MessageList.findIndex(e => e.id === id);
            this.MessageList.splice(index, 1);
            localStorage.removeItem(id);
        },
        UpdateSticky(val) {
            var index = this.MessageList.findIndex(e => e.id === val.id);
            this.MessageList[index].x = val.x;
            this.MessageList[index].y = val.y;
            localStorage.setItem(val.id, JSON.stringify(val));
        },
        TextChanged(val) {
            console.log(val);
            this.todoList[val.id] = val.message;
            console.log(this.todoList)
            var temp = [];
            for (var i = 0; i < this.todoList.length; i++) {
                temp[i] = this.todoList[i] + ' -ENDOFTASK- ';
            }
            localStorage.setItem("todo", temp);
            this.todoItem = undefined;
        }
    },

    template: `
        <div class="box is-scrollable">
        <sticky v-for="data in MessageList" :message="todoList[data.id]" :id="data.id" :x="data.x" :y="data.y" @change="UpdateSticky" @remove="RemoveSticky" @textchanged="TextChanged"></sticky>
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
                        <th class="text-white">
                            <div class="columns">
                                <div class="column is-9"> 
                                    {{item}}
                                </div>
                                <div class="column has-text-right">
                                    <button class="button is-dark is-small" @click="AddNote(index)"> <i class="fas fa-sticky-note"></i> </button>
                                    <button class="button is-dark is-small" @click="Remove(index)"> x </button>
                                </div>
                        </th>
                        
                    <tr>
                </tbody>
            </table>
        
        </div>`
});



Vue.component('sticky', {
    props: ['message', 'id', 'x', 'y'],
    data: function () {
        return {
            isClicked: false,
            editing: false
        }
    },
    mounted() {
        var top = this.y | 0;
        var left = this.x | 0;
        var dm = document.getElementById(this.id);
        dm.addEventListener('dragstart', this.drag_start, false);
        document.body.addEventListener('dragover', this.drag_over, false);
        document.body.addEventListener('drop', this.drop, false);
        dm.style.left = left + "px";
        dm.style.top = top + "px";
    },
    methods: {
        drag_start(event) {
            if (this.isClicked) {
                var style = window.getComputedStyle(event.target, null);
                event.dataTransfer.setData("text/plain",
                    (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
            }
        },
        drag_over(event) {
            if (this.isClicked) {
                event.preventDefault();
                return false;
            }
        },
        drop(event) {
            if (this.isClicked) {
                var offset = event.dataTransfer.getData("text/plain").split(',');
                var dm = document.getElementById(this.id);
                dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
                dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
                event.preventDefault();
                this.$emit('change', {
                    id: this.id,
                    x: event.clientX + parseInt(offset[0], 10),
                    y: event.clientY + parseInt(offset[1], 10)
                });
                return false;
            }
        },
        changeText() {
            this.$emit('textchanged', {
                id: this.id,
                message: this.message
            });
            this.editing = false;
        }
    },

    template: `
        <aside draggable="true" :id="id" @mouseover="isClicked=true" @mouseleave="isClicked=false">
            <div v-if="!editing" @click="editing=true">
                <div class="has-text-right">
                    <button class="button is-dark is-small has-text-right" @click="$emit('remove',id)">x</button>
                </div>
                {{message}}
            </div>
            <div v-if="editing">
                <textarea class="textarea" v-model="message" @keydown.enter="changeText"></textarea>
            </div>
        </aside>    
    `
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