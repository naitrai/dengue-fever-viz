import make_timeline as mt
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
from matplotlib.ticker import FuncFormatter

fontP = FontProperties()
fontP.set_size('small')

def to_d_of_d(data):
    columns = ['index', "Category","Code","Source","Type of Fund","Fiscal Year","Amount"]
    #           0       1           2      3        4              5             6
    new_data = {}
    names = []
    for l in data:
        if(l[5][0] == '2'):
            if (l[3], l[1], l[4]) not in new_data:
                new_data[(l[3], l[1], l[4])] = np.array([int(l[6].replace(',',''))], dtype=np.int64)
                if l[3] not in names:
                    names.append(l[3])
            else:
                new_data[(l[3], l[1], l[4])] = np.append(new_data[(l[3], l[1], l[4])], [int(l[6].replace(',',''))])
    return new_data, names

data = mt.read_csv('history.csv', header=False)
data, names = to_d_of_d(data)

lengths = [len(data[k]) for k in data]
maxl = max(lengths)

bad = {k:data[k] for k in data if len(data[k]) < maxl}
bad_l = []
for k in data.keys():
    if k in bad:
        if len(data[k]) == 17:
            data[k] = np.append(data[k], np.zeros([1],dtype=np.int64))
        if len(data[k]) == 14:
            data[k] = np.append(np.zeros([4],dtype=np.int64), data[k])
        if len(data[k]) == 3:
            bad_l.append(k)

for k in bad_l:
    del(data[k])


full_stacked = np.stack([data[k] for k in data], axis=0)
x = np.array(range(2000, 2018), dtype=np.int64)
# fig =plt.figure(); ax = plt.subplot(111)
# ax.stackplot(x, full_stacked)
# ax.legend([k for k in data], bbox_to_anchor=(2, 1.05))
# plt.show()

name_only = {}
for k in data:
    if k[0] not in name_only:
        name_only[k[0]] = data[k]
    else:
        name_only[k[0]] += data[k]
    if k[0] == 'Transfers & Loans':
        print(k)

#General Funds - Special Funds
tnl = data['Transfers & Loans', 'Transfers & Loans', 'General Fund']\
    + data['Transfers & Loans', 'Transfers & Loans', 'Special Funds']

bad_l = ['Transfers & Loans', 'All Other Minor Revenue']
for k in name_only:
    scale = name_only[k][0]

    if scale != 0:
        name_only[k] = name_only[k]/scale
    else:
        print(k)
        bad_l.append(k)

all_max = [max(name_only[k]) for k in name_only]
all_max.sort(reverse=True)

limit = all_max[6]

# For the area chart replace the if statement to check if the max revenue is under limit
for k in name_only:
    if min(name_only[k]) == 0 or k == 'Transfers & Loans' or (max(name_only[k]) < 2.5 and min(name_only[k]) > .5):
        bad_l.append(k)

for k in bad_l:
    if k in name_only:
        del(name_only[k])

stacked = np.stack([name_only[k] for k in name_only], axis=0)
fig = plt.figure(); ax = plt.subplot(111)
# Transfer Code
ax.plot(x,tnl, lw=3)
ax.fill_between(x,0,tnl,alpha=.3)

# Stacked graph code  deleted, but you just ax.stackplot full_stacked
# For percent change graph
# for y in np.flipud(stacked):
#     ax.semilogy(x,y)
# box = ax.get_position()
# ax.set_position([box.x0, box.y0, box.width * 0.8, box.height])
# names = [k for k in name_only]

# for %
# def millions(x, pos):
#     return '%1.0f%%' % (x*100)
def millions(x, pos):
    return '$%1.1fM' % (abs(x*1e-6))

formatter = FuncFormatter(millions)
ax.yaxis.set_major_formatter(formatter)

#ax.legend(names, loc='upper center', bbox_to_anchor=(1.15, 1.01))
box = ax.get_position()
plt.xticks(x)
#plt.yticks([.01,.1,1,10])
plt.title('Loans Taken Out or Paid off Per Year, ')
plt.ylabel('Paid Off <--    --> Taken Out')
plt.show()