window.__ModuleLoader__.load({
  id: '@fairyonthetree/pirate-locale',
  factory() {
    function registerPack(locale, pack) {
      const disposers = [];
      const release = () => {
        let failure;
        for (const dispose of disposers.splice(0).reverse()) {
          try { dispose(); } catch (error) { failure ??= error; }
        }
        if (failure !== undefined) throw failure;
      };

      try {
        for (const [namespace, dictionary] of Object.entries(pack.dictionaries)) {
          disposers.push(locale.register(namespace, pack.id, dictionary));
        }
        disposers.push(locale.addLanguage({ id: pack.id, label: pack.label, fallback: pack.fallback }));
      } catch (error) {
        try { release(); } catch {}
        throw error;
      }
      return release;
    }

    return {
      inject: ['locale', 'configForms'],
      apply(ctx) {
        return ctx.effect(() => {
          const form = ctx.configForms.get('locale-pack-loader');
          let current;
          let disposePack;
          const sync = () => {
            const { status, value } = form.getSnapshot();
            if (status === 'loading') return;
            const pack = status === 'ready' ? value?.pack : undefined;
            const revision = JSON.stringify(pack);
            if (current === revision) return;
            const previous = disposePack;
            disposePack = undefined;
            current = undefined;
            try {
              previous?.();
              disposePack = pack ? registerPack(ctx.locale, pack) : undefined;
              current = revision;
            } catch (error) {
              console.error('[locale-pack-loader] Language pack registration failed:', error);
            }
          };
          const unsubscribe = form.subscribe(sync);
          sync();
          return () => {
            try { unsubscribe(); } finally { disposePack?.(); }
          };
        }, 'locale-pack-loader: language pack');
      },
    };
  },
});
