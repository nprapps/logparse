#!/usr/bin/env python

from collections import defaultdict
import datetime
import json
import time as pytime

with open('test.log', 'rb') as f:
    output_dict = {}
    for line in f:
        entry_dict = {}
        l = line.split(' ')
        date = l[0]
        time = l[1]
        timestamp = datetime.datetime.strptime("%s %s" % (date, time), "%Y-%m-%d %H:%M:%S,%f")
        entry_dict['timestamp'] = pytime.mktime(timestamp.timetuple())
        entry_dict['msg_type'] = l[2]
        entry_dict['msg_code'] = l[3]
        info = l[4:]
        output_dict.setdefault(date, {})
        output_dict[date].setdefault(str(timestamp.hour), {})
        output_dict[date][str(timestamp.hour)].setdefault('items', [])
        output_dict[date][str(timestamp.hour)]['items'].append(entry_dict)
    print json.dumps(output_dict)
    # Either write this to file or pump to S3 or figure out a gameplan for our output shizz
