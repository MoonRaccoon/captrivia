package api

import (
	"math/rand"
	"net/http"
	"time"

	"github.com/ProlificLabs/captrivia/types/common"
	"github.com/gin-gonic/gin"
)

func (gs *GameServer) QuestionsHandler(c *gin.Context) {
	shuffledQuestions := shuffleQuestions(gs.Questions)
	c.JSON(http.StatusOK, shuffledQuestions[:10])
}
func shuffleQuestions(questions []common.Question) []common.Question {
	rand.Seed(time.Now().UnixNano())
	qs := make([]common.Question, len(questions))

	// Copy the questions manually, instead of with copy(), so that we can remove
	// the CorrectIndex property
	for i, q := range questions {
		qs[i] = common.Question{ID: q.ID, QuestionText: q.QuestionText, Options: q.Options}
	}

	rand.Shuffle(len(qs), func(i, j int) {
		qs[i], qs[j] = qs[j], qs[i]
	})
	return qs
}
