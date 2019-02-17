
"""
    Adds "" for shaders so it doesnt have to done by hand   
"""

import sys

with open(sys.argv[1]) as f:
    with open(sys.argv[1]+"_out", "w") as of:
        for line in f:
            stripped = line.rstrip()
            if stripped:
                of.write('"' + stripped + '",\n')
         