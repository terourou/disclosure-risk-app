FROM rocker/r-ver:4.2

LABEL org.label-schema.license="GPL-2.0" \
      org.label-schema.vcs-url="https://github.com/terourou/disclosure-risk-app" \
      maintainer="Tom Elliott <tom.elliott@auckland.ac.nz>"

RUN apt-get update -qq \
    && install2.r Rserve

COPY dependencies.txt ./

RUN install2.r "$(cat dependencies.txt)"

COPY . .

EXPOSE 8081

CMD ["Rscript", "start.R"]
