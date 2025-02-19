package main

import (
	"log"
	"os"
	"time"

	"github.com/sethvargo/go-githubactions"
)

func main() {
  log.SetOutput(os.Stdout)
  action := githubactions.New()
  val := action.GetInput("who-to-greet")
  if val == "" {
    val = "World"
  }
  action.Infof("Hello %v", val)
  log.Printf("Hello, %v", val)
  env := os.Getenv("ENV")
  log.Printf("Env is: %v", env)
  time := time.Now().String()
  defer func() {
    if err := recover(); err != nil {
      log.Println("Running locally")
    }
  }()
  action.SetOutput("time", time)
  log.Println("Running on Github")
  os.Exit(0)
}
