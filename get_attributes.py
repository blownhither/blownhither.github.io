import PyPDF2
import pickle
import os
import pandas as pds
import numpy as np
from sklearn.naive_bayes import BaseDiscreteNB, GaussianNB
import itertools

def _parse_page(page_string):
    start = 0
    ret = []
    while True:
        ind = page_string.find('Label:', start)
        if ind < 0:
            break
        end = page_string.find('Section', ind)
        label = page_string[ind:end].replace('\n', '').replace('  ', ' ')
        label = label.lstrip('Label: ').strip().replace(' ', '-')
        ind = page_string.find('Column:', ind)
        end = page_string.find('Type', ind)
        column = page_string[ind:end].replace('\n', '').replace('  ', ' ')
        column = _parse_column(column.lstrip('Column: '))
        ret.append((label, column))
        print(label, column)
        start = end + 1
    return ret


def parse_all_pages():
    """
    use this
    """
    if os.path.exists('attributes.bin'):
        attributes = pickle.load(open('attributes.bin', 'rb'))
        return attributes

    pdfReader = PyPDF2.PdfFileReader(open('codebook17_llcp-v2-508.pdf', 'rb'))
    attributes = []
    for page in pdfReader.pages:
        attributes.extend(_parse_page(page.extractText()))
    # print(attributes)
    pickle.dump(attributes, open('attributes.bin', 'wb'))
    print('Dumped')
    return attributes


def _parse_column(s):
    if '-' in s:
        a, b = s.split('-')
        return int(a) - 1, int(b)
    return int(s) - 1, int(s)


def _parse_table(s, ind):
    end = s.find('Label:', ind)
    if end == -1:
        end = len(s)
    s = s[ind:end]
    tokens = s[:s.index('Label:', 300)].split('\n \n')
    start = tokens.index('Weighted \nP\nercentage')
    d = {}
    for i in range(start + 1, len(tokens), 5):
        d[tokens[i]] = d[tokens[i + 1]]
    return d


def read_all_txt(attributes):
    if os.path.exists('array.bin'):
        dataset = pickle.load(open('array.bin', 'rb'))
        return dataset

    f = open('BRFSS2017.txt', 'r')
    dataset = []
    for line in f.readlines():
        row = []
        for label, (col_start, col_end) in attributes:
            entry = line[col_start:col_end]
            row.append(entry)
        dataset.append(row)
        # print(row)
    pickle.dump(open('array.bin', 'wb'), dataset)
    return dataset


def _to_csv(attributes, dataset):
    columns = [l for l, _ in attributes]
    df = pds.DataFrame(data=dataset, columns=columns)
    df.to_csv('BRF.csv')


def correlation(col1, width1, col2, width2):
    n = len(col1)
    empty1 = ' ' * width1
    empty2 = ' ' * width2
    index1 = (col1 != empty1).tolist() if col1.dtype == 'object' else [True] * n
    index2 = (col2 != empty2).tolist() if col2.dtype == 'object' else [True] * n
    index = np.logical_and(index1, index2)
    col1 = col1[index]
    col2 = col2[index]
    model = GaussianNB()
    col1 = np.array(col1).reshape((-1, 1))
    model.fit(col1, col2)
    score = model.score(col1, col2)
    print(score[1, 0])


def covariance(col1, col2, mask1, mask2):
    joint = np.logical_and(mask1, mask2)
    col1 = col1[joint]
    col2 = col2[joint]

    n = len(col1)
    index1 = (col1 != ' ' * len(col1[0])).tolist() if col1.dtype == 'object' else [True] * n
    index2 = (col2 != ' ' * len(col2[0])).tolist() if col2.dtype == 'object' else [True] * n
    index = np.logical_and(index1, index2)
    col1 = col1[index]
    col2 = col2[index]

    col1 = np.array(col1, dtype=np.int)
    col2 = np.array(col2, dtype=np.int)
    data = np.stack((col1, col2))
    # print(data.shape)
    cov = np.corrcoef(data, rowvar=True)
    # print('{:+.5f}'.format(cov[1, 0]))
    return cov[1, 0]


def replace_blank(col, target):
    empty = ' ' * len(str(col[0]))
    col[col == empty] = target
    return col


def _standard_process(col, upper, replace_target=''):
    """ return mask, replace blank if type is object """
    if col.dtype == 'object' and replace_target != '':
        col = replace_blank(col.copy(), replace_target).astype(np.int)
    mask = (col < upper)
    return col, mask


from collections import namedtuple
column_t = namedtuple('column', ['name', 'desc', 'data', 'mask'])


def cross_product(col_set1, col_set2=None):
    """
    corrcoef of each element
    """
    if col_set2 is None:
        col_set2 = col_set1
    table = []
    for col1 in col_set1:
        row = []
        for col2 in col_set2:
            cov = covariance(col1.data, col2.data, col1.mask, col2.mask)
            # if abs(cov) > 0.1 and cov != 1.00000:
            print(col1.name, ' v.s. ', col2.name, '\t', '{:+.5f}'.format(cov))
            row.append(cov)
        table.append(row)
    return table


def get_all_diseases(df):
    columns = []

    # col3 = df['How-Often-Do-You-Eat-Potatoes']
    # col3, mask3 = _standard_process(col3, 400, '999')
    # col3 = col3 / 100
    # columns.append(column_t('Potatoes', 'How-Often-Do-You-Eat-Potatoes', col3, mask3))

    # ["Blood Cholesterol", "Diabetes", "Cardiovascular Disease", "Sleep Disorder", "High Blood Pressure", "Arthritis",
    #  "Asthma", "Cancer", "Difficulty in Vision", ]

    col = df['Ever-Told-Blood-Cholesterol-High']
    col, mask = _standard_process(col, 3, '9')
    columns.append(column_t('Blood Cholesterol', 'Ever-Told-Blood-Cholesterol-High', col, mask))

    col2 = df['(Ever-told)-you-have-diabetes']
    print(col2.dtype)
    col2, mask2 = _standard_process(col2, 5, '9')
    col2 = (col2 / 2 + 0.1).astype(np.int)
    columns.append(column_t('Diabetes', '(Ever-told)-you-have-diabetes', col2, mask2))

    col5 = df['Ever-Diagnosed-with-Heart-Attack']
    col5, mask5 = _standard_process(col5, 3, '9')
    columns.append(column_t('Cardiovascular Disease', 'Ever-Diagnosed-with-Heart-Attack', col5, mask5))

    col = df['Days-had-trouble-with-sleep']
    col, mask = _standard_process(col, 15, '99')
    columns.append(column_t('Sleep Disorder', 'Days-had-trouble-with-sleep', col, mask))

    col = df['Ever-Told-Blood-Pressure-High']
    col, mask = _standard_process(col, 3, '9')
    columns.append(column_t('High Blood Pressure', 'Days-had-trouble-with-sleep', col, mask))

    col = df['Told-Have-Arthritis']
    col, mask = _standard_process(col, 3, '9')
    columns.append(column_t('Arthritis', 'Told-Have-Arthritis', col, mask))

    col4 = df['Ever-Told-Had-Asthma']
    col4, mask4 = _standard_process(col4, 3, '9')
    columns.append(column_t('Asthma', 'Ever-Told-Had-Asthma', col4, mask4))

    col1 = df['(Ever-told)-you-had-skin-cancer?']
    col1, mask1 = _standard_process(col1, 3, '9')
    col2 = df['(Ever-told)-you-had-any-other-types-of-cancer?']
    col2, mask2 = _standard_process(col2, 3, '9')
    col = np.minimum(col1, col2)
    mask = np.logical_and(mask1, mask2)
    columns.append(
        column_t('Cancer', '(Ever-told)-you-had-skin-cancer?(Ever-told)-you-had-any-other-types-of-cancer?', col, mask))

    col = df['Blind-or-Difficulty-seeing']
    col, mask = _standard_process(col, 3, '9')
    columns.append(column_t('Difficulty in Vision', 'Blind-or-Difficulty-seeing', col, mask))

    names = [x.name for x in columns]
    table = cross_product(columns, columns)

    # desc = [x.desc for x in columns]
    print(len(names), names)
    table = table - np.diag(np.diag(table))
    table = np.abs(table)

    # # normalize
    table = np.abs(np.array(table))
    table = table / np.expand_dims(table.sum(axis=1), 1)
    return table, columns


def get_all_habits(df, disease_columns):
    columns = []

    col = df['Avg-alcoholic-drinks-per-day-in-past-30']
    col, mask1 = _standard_process(col, 76, '99')
    columns.append(column_t('alcoholic', 'Avg-alcoholic-drinks-per-day-in-past-30', col, mask1))

    col = df['How-many-times-did-you-eat-fruit?']
    col, mask = _standard_process(col, 500, '999')
    col = (col / 100).astype(np.int)
    columns.append(column_t('fruit', 'How-many-times-did-you-eat-fruit?', col, mask))

    col = df['Exercise-in-Past-30-Days']
    col, mask = _standard_process(col, 3, '9')
    columns.append(column_t('exercise', 'Exercise-in-Past-30-Days', col, mask))

    col = df['How-often-did-you-drink-sugar-sweetened-drinks?']
    col, mask = _standard_process(col, 900, '999')
    col[col == 888] = 0
    col[col == 777] = 0
    col = (col / 100).astype(np.int)
    columns.append(
        column_t('sweet', 'How-often-did-you-drink-sugar-sweetened-drinks?', col, mask)
    )

    col = df['During-the-past-30-days,-on-how-many-days-did-you-use-marijuana-or-hashish?']
    col, mask = _standard_process(col, 90, '99')
    col[col == 88] = 0
    columns.append(
        column_t('marijuana', 'During-the-past-30-days,-on-how-many-days-did-you-use-marijuana-or-hashish?', col, mask)
    )

    # col = df['How-often-did-you-drink-regular-soda-or-pop-that-contains-sugar?']
    # col, mask = _standard_process(col, 900, '999')
    # col[col == 888] = 0
    # col = (col / 100).astype(np.int)
    # columns.append(
    #     column_t('soda', 'How-often-did-you-drink-regular-soda-or-pop-that-contains-sugar?', col, mask)
    # )
    table = cross_product(disease_columns, columns)
    table = np.abs(table)

    # normalize
    table = np.abs(np.array(table))
    table = table / np.expand_dims(table.sum(axis=1), 1)

    disease_dim = len(disease_columns)
    habit_dim = len(columns)
    meta_row1 = np.concatenate((np.zeros((disease_dim, disease_dim)), table), axis=1)
    meta_row2 = np.concatenate((table.T, np.zeros((habit_dim, habit_dim))), axis=1)
    meta = np.concatenate((meta_row1, meta_row2), axis=0)
    print(meta.shape)
    return meta, columns


def main():
    df = pds.read_csv('BRF.csv')
    disease_table, disease_columns = get_all_diseases(df)
    # print(str(disease_table.tolist()))
    habit_table, habit_columns = get_all_habits(df, disease_columns)
    disease_names = [x.name for x in disease_columns]
    habit_names = [x.name for x in habit_columns]
    print(disease_names, habit_names)
    print(str(habit_table.tolist()))


if __name__ == '__main__':
    main()
