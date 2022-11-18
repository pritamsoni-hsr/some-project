lint:
	black svc
	yarn --cwd=app run prettier --config=../.prettierrc --ignore-path=../.prettierignore -w .
	# yarn --cwd=app run eslint --config=.eslintrc.json --fix .

develop:
	DEBUG=True python svc

develop-app:
	yarn --cwd=app start

serve:
	python svc

# generate openapi schema
generate:
	python svc/openapi.py
	rm -rf app/src/common/api/openapi
	docker run --rm \
		-v ${PWD}:/repo openapitools/openapi-generator-cli:v6.2.1 generate \
		-i /repo/openapi.json \
		-g typescript-fetch \
		--skip-validate-spec \
		-o /repo/app/src/common/api/openapi


test:
	py.test svc

test-e2e:
	py.test -c=pytest.e2e.ini svc

test-app:
	yarn --cwd=app test
