import os, sys, ast
gif_dir='C:\\Users\\hduon\\AppData\\Local\\Programs\\Python\\Python39\\Scripts\\Portfolio\\webserver\\frontend\\src\\gifs'
remove_base='C:\\Users\\hduon\\AppData\\Local\\Programs\\Python\\Python39\\Scripts\\Portfolio\\webserver\\frontend\\src'
print(gif_dir)

path=os.walk(gif_dir)
output=[]
for base,dirs,files in path:
    for file in files:
        if file != 'imports.txt':
            path=str(base+'\\'+file)
            result=path.replace(remove_base,'..').replace('\\','/')
            #output.append(f'''import {str(file).replace('.gif','')} from '{result}';\n''')
            output.append({f"{result}":f"{str(file).replace('.gif','')}"})

action=open(gif_dir+'\\'+'imports.txt',"w")
print(output,file=action)
action.close()

# Read in the file
with open(gif_dir+'\\'+'imports.txt',"r") as file :
  filedata = file.read()

# Replace the target string
filedata = filedata.replace("'", '"')

# Write the file out again
with open(gif_dir+'\\'+'imports.txt',"w") as file:
  file.write(filedata)