from posixpath import dirname
from turtle import color
import pandas as pd
import matplotlib.pyplot as plt
import os


dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, 'archive/Age-standardized-suicide-rates.csv')
data = pd.read_csv(filename)
df = pd.DataFrame(data)

x = list(df.iloc[:10, 0])
y = list(df.iloc[:10, 2])

print(y)
plt.bar(x, y, color='g')
plt.show()