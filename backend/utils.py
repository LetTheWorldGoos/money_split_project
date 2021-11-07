# import re
# import pandas as pd
# import numpy as np
import datetime


# calculate for question 1.4
def check_bill(debit, credit,title):
    # efficiency first!
    debit = dict(debit)
    credit = dict(credit)
    keys = set(list(debit.keys()) + list(credit.keys()))
    opt = []
    for key in keys:
        if key in debit.keys():
            if key in credit.keys():
                 opt.append({
                     title:key,
                     "Amount":debit[key] - credit[key]
                 })
            else:
                opt.append({
                    title: key,
                    "Amount": debit[key]
                })
        elif key in credit.keys():
            opt.append({
                title: key,
                "Amount": -credit[key],
                "type":"credit"
            })
    return opt

# package cursor dt to format ( fetch result
def cur_to_dict(names, data):
    ans = []
    len_names = len(names)
    for line in data:
        keyval = {}
        for i in range(len_names):
            if isinstance(line[i], datetime.datetime):
                temp = datetime.datetime.strftime(line[i], format='%Y-%m-%d %H:%M:%S')
                keyval[names[i]] = temp
            else:
                keyval[names[i]] = line[i]
        ans.append(keyval)
    return ans
