package api

import "github.com/ProlificLabs/captrivia/types/common"

type GameServer struct {
	Questions []common.Question
	Sessions  *common.SessionStore
}

func NewGameServer(questions []common.Question, store *common.SessionStore) *GameServer {
	return &GameServer{
		Questions: questions,
		Sessions:  store,
	}
}
