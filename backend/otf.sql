\echo 'Delete and recreate only_family db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE only_family;
CREATE DATABASE only_family;
\connect only_family

\i otf-schema.sql

\echo 'Delete and recreate only_family_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE only_family_test;
CREATE DATABASE only_family_test;
\connect only_family_test

\i otf-schema.sql
