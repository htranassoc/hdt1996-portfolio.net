from Utils.py.file_manager import FileManager
FS = FileManager()

js_files=FS.findFilesbyExt(file_type=".js",location="web_services/frontend/build/static")
css_files=FS.findFilesbyExt(file_type=".css",location="web_services/frontend/build/static")

for index, i in enumerate(js_files):
    js_files[index] = i.replace("web_services/frontend/build",'react')

for index, i in enumerate(css_files):
    css_files[index] = i.replace("web_services/frontend/build",'react')
print(js_files)
print(css_files)