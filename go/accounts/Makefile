.DEFAULT_GOAL := help
.EXPORT_ALL_VARIABLES:

debug: ## build project with debug
	go build -gcflags=all="-N -l" -o accounts accounts.go

build: ## build project
	go build -o accounts accounts.go

run: build ## run project
	./accounts --uri https://kovan.infura.io/v3/f475934946b5469393962d48c58497ea --account-address 0x5836187D93100836FaF0478224Ac8dD2C85776d7

watch: ## hot-reloading
	reflex -s -r '\.go$$' make run

help: ## print command help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'