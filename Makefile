lint:
	black svc
	yarn --cwd=. run prettier --config=.prettierrc --ignore-path=.prettierignore -w .
	# yarn --cwd=. run eslint --config=.eslintrc.json --fix .

gen-random-data:
	python svc --action=generate-random-data

develop:
	DEBUG=True python svc

develop-app:
	yarn --cwd=. start

serve:
	python svc

# generate openapi schema
generate:
	python svc --action=generate-openapi-schema
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
	yarn --cwd=. test


build-docs:  # generate website from docs, and don't track generated code.
	npx create-docusaurus@latest my-website classic --typescript
	cd my-website && rm -rf docs blogs \
		&& cp -r ../docs . && mv docs/docusaurus.config.js . \
		&& mv ./src/css/custom.css . && rm -rf ./src
