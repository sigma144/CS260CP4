var app = new Vue({
  el: '#app',
  data: {
    username: "",
    password: "",
    error: "",
    state: "login",
    quizzes: {},
    quiz: {creator: "", title: "", desc: "", resultdesc: "",
	personalities: [], questions: []},
    curQuestion: 0,
    selectedAnswer: -1,
    scores: [],
    winPersonality: {},
    editing: false,
    accounts: []
  },
  created: function() {

  },
  methods: {
    login: function() {
      axios.put("http://192.241.224.206:3000/api/login", {
	username: this.username,
	password: this.password
      }).then(response => {
	if (response.data.msg === "Success")
	  this.init();
	else this.error = response.data.msg;
	return true;
      }).catch(err => {
      });
    },
    init: function() {
      this.state = "list";
      this.quiz = {creator: "", title: "", desc: "", resultdesc: "",
	personalities: [], questions: []};
      this.curQuestion = 0;
      this.selectedAnswer = -1;
      this.editing = false;
      this.getQuizzes();
    },
    getQuizzes: function() {
      axios.get("http://192.241.224.206:3000/api/quizzes").then(response => {
	this.quizzes = response.data;
	return true;
      }).catch(err => {
      });
    },
    createQuiz: function() {
      this.quiz = {creator: this.username, title: "", desc: "", resultdesc: "", 
	personalities: [], questions: []},
      this.state = "details";
      this.addPersonality();
      this.addQuestion();
    },
    changeState: function(state) {
      this.state = state;
    },
    playQuiz: function(id) {
      axios.get("http://192.241.224.206:3000/api/quiz/" + id).then(response => {
        this.quiz = response.data;
	this.state = "playtitle";
	this.scores = this.quiz.personalities.map(p => 0);
	this.curQuestion = 0;
	this.selectedAnswer = -1;
        return true;
      }).catch(err => {
      });
    },
    selectAnswer: function(index) {
      this.selectedAnswer = index;
    },
    nextQuestion: function() {
      this.scores[this.selectedAnswer]++;
      this.selectedAnswer = -1;
      this.curQuestion++;
      if (this.curQuestion >= this.quiz.questions.length)
      {
	let max = this.scores.reduce((high, current) =>
	  (current > high ? current : high), 0);
	this.winPersonality = this.quiz.personalities[this.scores.indexOf(max)];
	this.state = "playresult";
      }
    },
    addQuiz: function() {
      axios.post("http://192.241.224.206:3000/api/quiz", {
	title: this.quiz.title,
	desc: this.quiz.desc,
	resultdesc: this.quiz.resultdesc,
	creator: this.quiz.creator,
	questions: this.quiz.questions,
	personalities: this.quiz.personalities
      }).then(response => {
	this.init();
	return true;
      }).catch(err => {
      });
    },
    editQuiz: function(id) {
      axios.get("http://192.241.224.206:3000/api/quiz/" + id).then(response => {
        this.quiz = response.data;
        this.state = "details";
	this.editing = true;
        return true;
      }).catch(err => {
      });
    },
    saveQuiz: function() {
      axios.put("http://192.241.224.206:3000/api/quiz/" + this.quiz.id, {
	title: this.quiz.title,
	desc: this.quiz.desc,
	resultdesc: this.quiz.resultdesc,
        questions: this.quiz.questions,
	personalities: this.quiz.personalities
      }).then(response => {
        this.init();
        return true;
      }).catch(err => {
      });
    },
    deleteQuiz: function(id) {
      axios.delete("http://192.241.224.206:3000/api/quiz/" + id).then(response => {
	this.init();
	return true;
      }).catch(err => {
      });
    },
    addPersonality: function() {
      this.quiz.personalities.push({name: "", text: "", image: ""});
      this.quiz.questions.forEach(q => q.answers.push(this.makeAnswer("")));
    },
    deletePersonality: function(personality) {
      let index = this.quiz.personalities.indexOf(personality);
      this.quiz.personalities.splice(index, 1);
      this.quiz.questions.forEach(q => q.answers.splice(index, 1));
    },
    makeAnswer: function(name) {
      return {text: "", personality: name};
    },
    addQuestion: function() {
      let qanswers = this.quiz.personalities.map(p => this.makeAnswer(p.title));
      let question = {text: "", answers: qanswers};
      this.quiz.questions.push(question);
    },
    deleteQuestion: function(question) {
      this.quiz.questions.splice(this.quiz.questions.indexOf(question), 1);
    }
  }
});
