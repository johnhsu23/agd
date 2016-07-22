This directory contains views that can be picked up and reused elsewhere. Some views are intended to be self-contained and shouldn't require subclassing -- such as the grade switcher -- whereas others are unlikely to do anything useful without augmentation.

However, classes named `default-*.ts` are intended to handle a large number of extremely common cases, and users are urged to simply instantiate those with their options rather than reaching for a custom subclass.
