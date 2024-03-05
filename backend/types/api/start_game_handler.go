package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (gs *GameServer) StartGameHandler(c *gin.Context) {
	sessionID := gs.Sessions.CreateSession()
	c.JSON(http.StatusOK, gin.H{"sessionId": sessionID})
}
