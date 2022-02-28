import csv, os, os.path
from typing import Iterable

def split_join(X,Y):
    X=X.split(Y)
    comb=''
    for x in X:
        comb+=(str(x)+'_')
    X=comb.rstrip(comb[-1])
    return X

def createproductlist():
    csvfile='C:/Users/hduon/desktop/ProductList.csv'
    Media_Folder='C:/Users/hduon/Desktop/Images'
    with open(csvfile,'w',newline='') as CSVFILE:
        writer=csv.writer(CSVFILE)
        writer.writerow(['id','name','price','digital','image'])
        id=1
        for base, dirs, files in os.walk(Media_Folder):
            for file in files:
                name=str(str(file).split('.')[0])
                type=str(str(file).split('.')[1])
                name=split_join(name,' ')
                filepath=os.path.join(base,str(file))
                destpath=os.path.join(base,name)

                os.rename(filepath,destpath+'.'+type)
                print(name+'.'+type)

                writer.writerow([id,name.replace('_',' '),0,0,str(file)])
                id+=1




    





