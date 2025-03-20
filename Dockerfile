FROM jboss/wildfly:16.0.0.Final

COPY scripts /scripts
COPY configs /configs

USER root
RUN /scripts/setup.sh
RUN rm -rf /scripts /configs

ENV LANG en_US.utf8

COPY --chown=jboss:jboss catalog /build/catalog
COPY --chown=jboss:jboss edit /build/edit
COPY --chown=jboss:jboss index /build/index

RUN chown jboss:jboss /build
USER jboss

RUN /build/catalog/docker.sh && \
    /build/edit/docker.sh && \
    /build/index/docker.sh && \
    rm -rf /build/*

CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-c", "standalone-full-mapseries.xml"]
