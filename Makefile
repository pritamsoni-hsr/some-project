develop:
	DEBUG=True python svc

serve:
	python svc

# generate openapi schema
generate:
	python svc/openapi.py

test:
	py.test svc
