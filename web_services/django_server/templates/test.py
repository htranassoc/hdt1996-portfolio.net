import os
for f in os.scandir("web_services/frontend/build/static"):
    print(f.path)