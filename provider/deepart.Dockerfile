
FROM tensorflow/tensorflow:latest

COPY deepart.py /golem/entrypoints/
COPY run.sh /golem/entrypoints/

RUN chmod +x /golem/entrypoints/run.sh

RUN pip install tensorflow_hub
RUN pip install Pillow
RUN pip install numpy
RUN python -c "import tensorflow_hub as hub; hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')"

VOLUME /golem/work /golem/output /golem/resource