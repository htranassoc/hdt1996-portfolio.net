import os
script_path = __file__.split('\\')
script_path.pop()
script_path = '\\'.join(script_path)
print(script_path, __file__)
webpack_config_path = os.path.join(script_path,'frontend','node_modules','react-scripts','config','webpack.config.js')
with open(webpack_config_path,'r') as f:
   lines = f.readlines()
   f.close()

with open(webpack_config_path,'w') as f:
    for line in lines:
        if '.[contenthash:8]' in line:
            line = line.replace('.[contenthash:8]','')
        if '[hash]' in line:
            line = line.replace('[hash]','')
        f.write(line)
    f.close()