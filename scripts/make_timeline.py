import csv
import sys
import argparse
from tqdm import tqdm
import re
import matplotlib.pyplot as plt
import collections
import pickle
import numpy as np

MONTHLY_TYPES = ['cases', 'deaths']
DATA_TYPES= ['humidity', 'rainfall', 'avg_temp', 'max_temp', 'max_temp', 'min_temp', 'sea_level_pressure']

def read_csv(file_name, header=False):
    data = []
    csv.register_dialect('myDialect',
                         delimiter=',',
                         skipinitialspace=True)
    with open(file_name, 'r') as f:
        reader = csv.reader(f, dialect='myDialect')
        for row in reader:
            line = []
            for val in row:
                line.append(val)
            data.append(line)
    return data[(1 if not header else 0):]


def save_data(data, save_name='full_data.pkl', data_dir='/home/jonesc48/dataviz/'):
    name = data_dir+save_name
    print("Saving to %s" % name)
    pickle.dump(data, open(name, 'wb'))


def load_data(load_name='full_data.pkl', data_dir='/home/jonesc48/dataviz/Dengue_Fever/Data/'):
    name = data_dir+load_name
    print("Loading from %s" % name)
    data = pickle.load(open(name, 'rb'))
    return data


def parse_stations_daily_float(data_list, data_name, prev_dict = {}):
    """
    Parses one of the Station, year, month, days of data files into a list of lists.
    :param data_list: A list of lists from a vsc
    :param data_name: name of this attribute
    :param prev_dict: the previous data to add the attribute to (default assumes none)
    :return:
    """
    loc_dict = prev_dict
    for line in tqdm(data_list):
        try:
            loc = line[0]
            if loc == "Cox's": #problem where min_temp csv is weird
                line = line[1:]
                line[0] = "Cox's Bazar"
            year = int(line[1])
            month = int(line[2])
            data = line[3:-1]
            for i in range(len(data)):
                data[i] = re.sub('\*\*\**', '-1', data[i])
            days = list(map(float, [x for x in data if x != '']))
            if not loc in loc_dict:
                loc_dict[loc] = {}
            if not year in loc_dict[loc]:
                loc_dict[loc][year] = {}
            if not month in loc_dict[loc][year]:
                loc_dict[loc][year][month] = {}
            loc_dict[loc][year][month][data_name] = days
        except Exception as err:
            print("ERROR: line exluded:")
            print(line)
    return loc_dict

def parse_total_cases(data_list, prev_dict={}):
    loc_dict = prev_dict
    for line in tqdm(data_list):
        try:
            loc = line[0]
            if loc == "Cox's":  # problem where min_temp csv is weird
                line = line[1:]
                line[0] = "Cox's Bazar"
            year = int(line[1])
            month = int(line[2])
            cases = int(line[3])
            deaths = int(line[4])
            if loc not in loc_dict:
                loc_dict[loc] = {}
            if year not in loc_dict[loc]:
                loc_dict[loc][year] = {}
            if month not in loc_dict[loc][year]:
                loc_dict[loc][year][month] = {}
            loc_dict[loc][year][month]['cases'] = cases
            loc_dict[loc][year][month]['deaths'] = deaths
        except Exception as err:
            print("ERROR: line exluded:")
            print(line)
            print(err)
    return loc_dict

def make_basic_chart(data, station, data_type):
    flat_y = []
    station_data = data[station]
    for year, months in station_data.items():
        for month, values in months.items():
            print(values)
            if data_type in values:
                if data_type in MONTHLY_TYPES:
                    flat_y.append(values[data_type])
                else:
                    flat_y += values[data_type]
    x = range(len(flat_y))
    plt.plot(x, flat_y)
    plt.show()

def combined_station_single_type(data, data_type):
    """
    Not finished, need to adjust for different data lengths.
    Maybe ask for min and max year and enforce those?
    :param data:
    :param data_type:
    :return:
    """

    flat_ys = {}
    for station, years in data.items():
        flat_ys[station] = []
        for year, months in years.items():
            for month, days in months.items():
                if data_type in days:
                    flat_ys[station] += days[data_type]
                else:
                    flat_ys[station] += [-1 for i in range(max(map(len, days)))]
    lengths = list(map(len, [v for k, v in flat_ys.items()]))
    print(lengths)
    x = range(max(list(map(len, flat_ys))))
    for station in data.keys():
        plt.plot(x, flat_ys[station])
    plt.show()

def symdt_to_tymds(data):
    """
    Converts a [station, year, month, day, type] dictionary tree to a type dict of list {type : [day(ymd), station]}list
    THIS IS EXTREMELY GROSS
    :param data: A [s,y,m,d,t] dict tree
    :return: list [num types, max days, num stations + 1], the + 1 is for a yyyymmdd string
    """
    stations = list(data.keys())
    stations.sort()  # Alphabetic list of stations (columns)
    minyear = 9000
    maxyear = 2018
    for station in stations:
        years = data[station].keys()
        if min(years) < minyear:
            minyear = min(years)

    mlen = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    # Flatten to [t,y,m,s] format if possible, else all 0's for the month
    for t in DATA_TYPES:
        print('started type ' + t)
        new_dict = {}
        for y in range(minyear, maxyear+1):
            new_dict[y] = {}
            for m in range(1, 13):
                new_dict[y][m] = {}
                for s in stations:

                    if y in data[s] and m in data[s][y] and t in data[s][y][m]:
                        new_dict[y][m][s] = data[s][y][m][t]
                    else:
                        new_dict[y][m][s] = [-1]*mlen[m-1] if y % 4 != 0 or m != 2 else [-1]*29  # leap year clause please kill me
        save_data(new_dict, 'full_'+t+'_as_dict.pkl')
    print('MADE TYMS DICT')
    del(data)

    for t in DATA_TYPES:
        table = []
        new_dict = load_data(('full_'+t+'_as_dict.pkl'))
        for y in range(minyear, maxyear+1):
            for m in range(1, 13):
                for d in range(len(new_dict[y][m][stations[1]])):
                    #print('day ' + d+':'+str([new_dict[y][m][s][d] for s in stations]))
                    try:
                        mstr = str(m)
                        if m < 10:
                            mstr = '0' + mstr
                        dstr = str(d+1)
                        if d+1 < 10:
                            dstr = '0' + dstr
                        table.append([str(y)+mstr+dstr]+[new_dict[y][m][s][d] for s in stations])  # create a row
                    except Exception as err:
                        print("ERROR: line exluded:")
                        print(str(y)+str(m)+str(d+1))
                        print(err)
        with open('full_'+t+'_table.csv', 'w') as write_file:
            print('writing '+'full_'+t+'_table.csv')
            writer = csv.writer(write_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            writer.writerow(['year'] + stations)
            for line in table:
                writer.writerow(line)



def main(args):
    if args.case_data:
        # Load all of the timeline csvs
        type_list = ['min_temp', 'avg_temp', 'max_temp', 'humidity', 'rainfall', 'sea_level_pressure']
        cases = read_csv('Data/Dengue_Dhaka_average_monthly_case_death_2000-2016_processed.csv')

        # {type: [month, staton_1 ... station_21} Dhaka is column 13
        #tables = {f:read_csv('full_'+f+'_table.csv', header=True) for f in type_list}

        # [Dhaka,year,month,cases,deaths]
        # d_column = tables['avg_temp'][0].index('Dhaka')
        # print("%d is the column of Dhaka" % d_column)
        # min_month = cases[0][2]
        # if int(min_month) < 10:
        #     min_month = '0' + min_month
        # max_month = cases[0][2]
        # if int(max_month) < 10:
        #     max_month = '0' + max_month
        # min_date = str(cases[0][1]) + min_month + '01'
        # max_date = str(cases[-1][1]) + max_month + '31'
        # print(min_date + ' to ' + max_date)
        # data = []
        # for t in type_list:
        #     tmp = tables[t] # Grab table
        #     tmp = [[r[0], r[d_column]] for r in tmp]
        #     mindex = [r[0] for r in tmp].index(min_date)
        #     maxdex = [r[0] for r in tmp].index(max_date)
        #     tmp = tmp[mindex:(maxdex+1)]
        #     c_to_append = [r[1] for r in tmp]
        #     data += c_to_append
        data2 = load_data()
        dhaka = data2['Dhaka']
        dhaka = {k:dhaka[k] for k in dhaka if k > 1999 and k < 2016}
        for k in dhaka:
            for m in dhaka[k]:
                print(k)
                print(m)
                dhaka[k][m]['humidity'] = np.average(dhaka[k][m]['humidity'])
                dhaka[k][m]['avg_temp'] = np.average(dhaka[k][m]['avg_temp'])
                dhaka[k][m]['rainfall'] = np.sum(dhaka[k][m]['rainfall'])
                if 'max_temp' in dhaka[k][m]:
                    del(dhaka[k][m]['max_temp'])
                if 'min_temp' in dhaka[k][m]:
                    del(dhaka[k][m]['min_temp'])
        for c in cases:
            if int(c[1]) < 2016:
                dhaka[int(c[1])][int(c[2])]['cases'] = int(c[3])
                dhaka[int(c[1])][int(c[2])]['deaths'] = int(c[4])
        save_data(dhaka, 'monthly_data.pkl')
        exit()
    if not args.full_list:
        file_name = args.data_dir + args.file_name
        data = read_csv(file_name)
        data_dict = parse_stations_daily_float(data, args.data_type)
        for region in sorted(data_dict.keys()):
            print(region)
        print("Num regions : %d" % len(data_dict.keys()))
        make_basic_chart(data_dict, 'Dhaka', 'temperature')
    else:
        file_list = { 'AverageHumidity_1953to2015.csv': 'humidity',
                      'AverageRainfall_1953to2015.csv': 'rainfall',
                      'AverageTemperature_1953to2015.csv': 'avg_temp',
                      'MaximumTemperature_1953to2014.csv': 'max_temp',
                      'MaximumTemperature2015.csv': 'max_temp',
                      'MinimumTemperature_1953to2014.csv': 'min_temp',
                      'seaLevelPressure_1953to2014.csv': 'sea_level_pressure'}
        file_list = {(args.data_dir + f): v for f, v in file_list.items()}
        data_dict = {}
        for f, v in file_list.items():
            print('##########################################')
            print(f,v)
            data = read_csv(f)
            data_dict = parse_stations_daily_float(data, v ,data_dict)
            print("Finished %s" % v)
            print('##########################################')
        # print(data_dict["Cox's Bazar"])
        # combined_station_single_type(data_dict, 'avg_temp')
        case_file = args.data_dir + 'Dengue_Dhaka_average_monthly_case_death_2000-2016_processed.csv'
        case_data = read_csv(case_file)
        data_dict = parse_total_cases(case_data, data_dict)
        #make_basic_chart(data_dict, 'Dhaka', 'cases')
        save_data(data_dict)
        tabular = symdt_to_tymds(data_dict)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='parse the json file')
    parser.add_argument('-d', '--data_dir', type=str, default='/home/jonesc48/dataviz/Dengue_Fever/Data/')
    parser.add_argument('-f', '--file_name', type=str, default='AverageTemperature_1953to2015.csv')
    parser.add_argument('-t', '--data_type', type=str, default='temperature')
    parser.add_argument('-F', '--full_list', action='store_true',
                        help='Parse every csv into a single structure')
    parser.add_argument('-c', '--case_data', action='store_true',
                        help='Whether or not youre adding in case data')
    args = parser.parse_args()
    main(args)
