#!/bin/bash
./build-image.sh
rm *.gvmi
gvmkit-build deepart-golem:latest
gvmkit-build deepart-golem:latest --push