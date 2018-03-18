var app = new Vue({
  el: '#app',
  data: {
    state: "list",
    quizzes: {},
    quiz: {title: "", personalities: [], questions: []},
    curQuestion: 0
  },
  created: function() {
    this.getQuizzes();
  },
  methods: {
    getQuizzes: function() {
      axios.get("http://192.241.224.206:3000/api/quizzes").then(response => {
	this.quizzes = response.data;
	return true;
      }).catch(err => {
      });
    },
    createQuiz: function() {
      this.quiz = {title: "", personalities: [], questions: []},
      this.state = "details";
    }
    playQuiz: function(quiz) {
      axios.get("http://192.241.224.206:3000/api/quiz/" + quiz.id).then(response => {
        this.quiz = response.data;
	state = "play";
        return true;
      }).catch(err => {
      });
    },
    addQuiz: function() {
      axios.post("http://192.241.224.206:3000/api/quiz", {
	title: this.quiz.title,
	questions: this.quiz.questions
      }).then(response => {
	this.quiz = {title: "", personalities: [], questions: []},
	this.state = "list";
	this.getQuizzes();
	return true;
      }).catch(err => {
      });
    },
    editQuiz: function() {
      axios.put("http://192.241.224.206:3000/api/quiz", {
        id: this.quiz.id,
	title: this.quiz.title,
        questions: this.quiz.questions
      }).then(response => {
        this.quiz = {title: "", personalities: [], questions: []},
        this.state = "list";
        this.getQuizzes();
        return true;
      }).catch(err => {
      });
    },
    deleteQuiz: function(quiz) {
      axios.delete("http://192.241.224.206:3000/api/quiz/" + quiz.id).then(response => {
	this.getQuizzes();
	return true;
      }).catch(err => {
      });
    },
    addPersonality: function() }
      this.quiz.personalities.push({name: "", text: ""});
      this.quiz.questions.forEach(q => q.answers.push(""));
    },
    addQuestion: function() {
      let question = {text: "", answers:
	this.quiz.personalities.map(p => {text: "", personality: p.name});
      this.quiz.questions.push(question);
    },
    deleteQuestion: function(question) {
      this.quiz.questions.splice(this.quiz.questions.indexOf(question), 1);
    }
  }
});
