# Zero-Operator Access

From an architecture perspective, our AI assistant and the mobile app are two separate apps with two different cybersecurity hardening profiles. To distinguish between the two we call the former Claire, and the latter Clairify The App (CTA). This page describes how Claire is zero-operator access (ZOA).

ZOA means that no one at Clairify and no one at your MSP can access your data. Only you can access it, and only via the mobile app. _Data_ means everything inside Claire, but namely Q&A sessions, the files you upload, the emails forwarded from CTA.

When your MSP provisions an instance of Claire to your organization, under the hood we deploy a container service. That container is isolated on the network from any other application other than
CTA. The container can't accept a login; it only listens on its own API, and the only application that can communicate over that API is one that is authenticated to be the CTA using asymmetric key encryption.

!!! tip "The Web Admin Panel"
    When setting up new users, or changing the behaviour of Claire, you or your MSP can do so through our web app. Only configuration information lives on the web app, no emails, sessions, or files.