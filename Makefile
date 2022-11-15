lint:
	black svc
	yarn --cwd=app run prettier --config=../.prettierrc --ignore-path=../.prettierignore -w .

develop:
	DEBUG=True python svc

serve:
	python svc

# generate openapi schema
generate:
	python svc/openapi.py
	rm -rf app/common/api/openapi
	docker run --rm \
		-v ${PWD}:/src openapitools/openapi-generator-cli:v6.2.1 generate \
		-i /src/openapi.json \
		-g typescript-fetch \
		--skip-validate-spec \
		-o /src/app/common/api/openapi


test:
	py.test svc

test-e2e:
	py.test -c=pytest.e2e.ini svc
