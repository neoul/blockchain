.DEFAULT_GOAL := help
.EXPORT_ALL_VARIABLES:

debug: ## build project with debug
	go build -gcflags=all="-N -l" -o main transactions.go

build: ## build project
	go build -o main transactions.go

run: build ## run project
	./main --uri https://kovan.infura.io/v3/f475934946b5469393962d48c58497ea --txhash "0x15b093f28f6e4c552e1aee945e8b9607aa041ebb687181b04691268f0384d839"

watch: ## hot-reloading
	reflex -s -r '\.go$$' make run

help: ## print command help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'