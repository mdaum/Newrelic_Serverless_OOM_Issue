# Newrelic_Serverless_OOM_Issue
Two lambdas that serve as a test bench to illustrate memory consumption issues with NR serverless monitoring running on lambdas that generate a lot of spans.

## Instructions to Reproduce
* update the `endpoint` variable in each lambda to point to a webserver that will give back 404s. We found that hitting a simple webserver we spun up w/o rate-limiting enforced with a parameterized route that will give 404 to be simplest way to do this.
* Optional: test setup with SAM-Local. Debug configurations for the stress test and control lambdas are supplied, along with run scripts. You will need `sam cli` and `docker` installed.
* Deploy lambads to your AWS acct
* We were able to pretty consistently blow out the memory of a 1GB lambda using the following env variables
    - RPM = 6000 (essentially allow lambda to run unbounded)
    - TIME_DOING_WORK = 850 (make sure you configure lambda for max runtime of 15 minutes)
