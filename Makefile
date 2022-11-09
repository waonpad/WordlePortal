APP_CONTAINER = app
APP_CONTAINER_NAME = fullstack-app
MAIN_BRANCH = main

build:
	docker-compose build
	docker-compose up -d
	docker-compose exec ${APP_CONTAINER} composer install
	docker-compose exec ${APP_CONTAINER} cp .env.example .env
	docker-compose exec ${APP_CONTAINER} php artisan key:generate
	docker-compose exec ${APP_CONTAINER} npm install --legacy-peer-deps
	docker-compose exec ${APP_CONTAINER} rm -rf node_modules/mui-chips-input/node_modules
	npm install
	start /min start.bat

up:
	start /min start.bat

down:
	docker-compose down

restart:
	docker-compose restart
	start /min docker-compose exec app npm run watch-poll



cmt-%:
	git commit -m "${@:cmt-%=%}"

push:
	git push origin HEAD

pull:
	git checkout ${MAIN_BRANCH}
	git pull origin ${MAIN_BRANCH}

newb-%:
	git checkout -b ${@:newb-%=%}

delb-%:
	git branch -d ${@:delb-%=%}



npmi:
	$(MAKE) -C src npmi

npmi-c:
	docker-compose exec ${APP_CONTAINER} npm install --legacy-peer-deps
	docker-compose exec ${APP_CONTAINER} rm -rf node_modules/mui-chips-input/node_modules



serve:
	docker-compose exec ${APP_CONTAINER} php artisan serve

key:
	docker-compose exec ${APP_CONTAINER} php artisan key:generate

ctrl-%:
	docker-compose exec ${APP_CONTAINER} php artisan make:controller ${@:ctrl-%=%}

mdl-%:
	docker-compose exec ${APP_CONTAINER} php artisan make:model ${@:mdl-%=%}

mig-%:
	docker-compose exec ${APP_CONTAINER} php artisan make:migration ${@:mig-%=%}

mig:
	docker-compose exec ${APP_CONTAINER} php artisan migrate

dbrefresh:
	docker-compose exec ${APP_CONTAINER} php artisan migrate:refresh

dbfresh:
	docker-compose exec ${APP_CONTAINER} php artisan migrate:fresh

dbreset:
	docker-compose exec ${APP_CONTAINER} php artisan migrate:reset

req-%:
	docker-compose exec ${APP_CONTAINER} php artisan make:request ${@:req-%=%}

seed-%:
	docker-compose exec ${APP_CONTAINER} php artisan make:seeder ${@:seed-%=%}

seed:
	docker-compose exec ${APP_CONTAINER} php artisan db:seed

prov-%:
	docker-compose exec ${APP_CONTAINER} php artisan make:provider ${@:prov-%=%}

middleware-%:
	docker-compose exec ${APP_CONTAINER} php artisan make:middleware ${@:middleware-%=%}

optm:
	docker-compose exec ${APP_CONTAINER} php artisan optimize

evt-%:
	docker-compose exec ${APP_CONTAINER} php artisan make:event ${@:evt-%=%}

acs:
	docker container exec -it ${APP_CONTAINER_NAME} /bin/ash