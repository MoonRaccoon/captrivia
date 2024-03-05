package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"

	"github.com/ProlificLabs/captrivia/types/api"
	"github.com/ProlificLabs/captrivia/types/common"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Setup the server
	router, err := setupServer()
	if err != nil {
		log.Fatalf("Server setup failed: %v", err)
	}

	// set port to PORT or 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start the server
	log.Println("Server starting on port " + port)
	log.Fatal(router.Run(":" + port))
}

// setupServer configures and returns a new Gin instance with all routes.
// It also returns an error if there is a failure in setting up the server, e.g. loading questions.
func setupServer() (*gin.Engine, error) {
	questions, err := loadQuestions()
	if err != nil {
		return nil, err
	}

	sessions := &common.SessionStore{Sessions: make(map[string]*common.PlayerSession)}
	server := api.NewGameServer(questions, sessions)

	// Create Gin router and setup routes
	router := gin.Default()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	config := cors.DefaultConfig()
	// allow all origins
	config.AllowAllOrigins = true
	router.Use(cors.New(config))

	router.POST("/game/start", server.StartGameHandler)
	router.GET("/questions", server.QuestionsHandler)
	router.POST("/answer", server.AnswerHandler)
	router.POST("/game/end", server.EndGameHandler)

	return router, nil
}

func loadQuestions() ([]common.Question, error) {
	fileBytes, err := ioutil.ReadFile("questions.json")
	if err != nil {
		return nil, err
	}

	var questions []common.Question
	if err := json.Unmarshal(fileBytes, &questions); err != nil {
		return nil, err
	}

	return questions, nil
}
