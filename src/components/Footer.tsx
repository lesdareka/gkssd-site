/**
 * The visitor exits the exhibition into a plain, undecorated lobby: a
 * minimal footer outside the pinned scene, on the secondary surface tone
 * so it visibly steps down from the diorama rather than competing with it.
 */
export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface px-6 py-16 md:px-16 lg:px-24">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <img src="/logo-full.svg" alt="ГКССД — Группа компаний стратегического строительства и девелопмента" className="h-16 w-auto md:h-20" />
        </div>
        <div className="flex flex-col gap-1 font-body text-sm text-ink-muted">
          <a href="mailto:info@gkssd.ru" className="transition-colors hover:text-ink">
            info@gkssd.ru
          </a>
          <a href="tel:+70000000000" className="transition-colors hover:text-ink">
            +7 (000) 000-00-00
          </a>
        </div>
      </div>
      <p className="mt-12 font-body text-xs text-ink-muted">
        © {new Date().getFullYear()} ГКССД — Стратегическое Строительство и Девелопмент. Все права защищены.
      </p>
    </footer>
  );
}
