if True:
    import os
    import sys

    sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from svc.config import config

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app="svc.app:app",
        reload=config.DEBUG,
        host="127.0.0.1" if config.DEBUG else "0.0.0.0",
    )
