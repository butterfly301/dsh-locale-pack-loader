window.__ModuleLoader__.load({
  id: 'dsh-locale-pack-loader',
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

    // Merge the legacy single `pack` alias and the new `packs` list into one
    // ordered, de-duplicated set. Later entries win on id collision.
    function collectPacks(value) {
      const list = [];
      if (value?.pack && typeof value.pack === 'object') list.push(value.pack);
      if (Array.isArray(value?.packs)) {
        for (const item of value.packs) {
          if (item && typeof item === 'object') list.push(item);
        }
      }
      const byId = new Map();
      for (const item of list) byId.set(item.id, item);
      return [...byId.values()];
    }

    return {
      inject: ['locale', 'configForms'],
      apply(ctx) {
        return ctx.effect(() => {
          const form = ctx.configForms.get('locale-pack-loader');
          let current;
          let disposePacks;
          const sync = () => {
            const { status, value } = form.getSnapshot();
            if (status === 'loading') return;
            const packs = status === 'ready' ? collectPacks(value) : [];
            const revision = JSON.stringify(packs);
            if (current === revision) return;
            const previous = disposePacks;
            disposePacks = undefined;
            current = undefined;
            try {
              previous?.();
              disposePacks = packs.length ? registerPacks(ctx.locale, packs) : undefined;
              current = revision;
            } catch (error) {
              console.error('[locale-pack-loader] Language pack registration failed:', error);
            }
          };
          const unsubscribe = form.subscribe(sync);
          sync();
          return () => {
            try { unsubscribe(); } finally { disposePacks?.(); }
          };
        }, 'locale-pack-loader: language packs');
      },
    };

    function registerPacks(locale, packs) {
      const releases = [];
      try {
        for (const pack of packs) releases.push(registerPack(locale, pack));
      } catch (error) {
        for (const release of releases.splice(0).reverse()) {
          try { release(); } catch {}
        }
        throw error;
      }
      return () => {
        let failure;
        for (const release of releases.splice(0).reverse()) {
          try { release(); } catch (error) { failure ??= error; }
        }
        if (failure !== undefined) throw failure;
      };
    }
  },
});
