import type { Exercise, RequestResult } from '../types'

export const EXERCISES: Exercise[] = [
  {
    id: 'ex1',
    number: 1,
    title: 'Pobierz listę produktów z kategorii elektronika',
    description:
      'Użyj metody GET żeby pobrać produkty. Przefiltruj wyniki dodając parametr do URL.',
    hint: 'Parametry w URL zaczynamy od znaku zapytania',
    method: 'GET',
    expectedStatus: 200,
    validate(result: RequestResult) {
      if (!result.ok) return { passed: false, message: `Oczekiwano statusu 200, dostałeś ${result.status}` }
      const data = result.data as any
      if (!Array.isArray(data?.items)) return { passed: false, message: 'Odpowiedź nie zawiera pola "items" z tablicą' }
      const allElektronika = data.items.every((p: any) => p.category === 'elektronika')
      if (!allElektronika) return { passed: false, message: 'Wyniki zawierają produkty z innych kategorii — dodaj ?category=elektronika do URL' }
      return { passed: true, message: `Świetnie! Dostałeś ${data.items.length} produkty z kategorii elektronika.` }
    },
  },
  {
    id: 'ex2',
    number: 2,
    title: 'Pobierz szczegóły Słuchawek',
    description:
      'Pobierz jeden konkretny produkt po jego ID',
    hint: 'sprawdz ID w dokumentacji',
    method: 'GET',
    expectedStatus: 200,
    validate(result: RequestResult) {
      if (!result.ok) return { passed: false, message: `Oczekiwano statusu 200, dostałeś ${result.status}` }
      const data = result.data as any
      if (data?.id !== 'p_9x2k') return { passed: false, message: 'To nie są Słuchawki — sprawdź ID w URL' }
      return { passed: true, message: `Poprawnie! Pobrałeś "${data.name}" za ${data.price} zł.` }
    },
  },
  {
    id: 'ex3',
    number: 3,
    title: 'Dodaj nowy produkt',
    description:
      'Użyj metody POST żeby dodać nowy produkt. Wymagane pola w body: `name` (string), `price` (number), `category` (string). Pole `stock` jest opcjonalne.',
    hint: 'Pamiętaj: price to liczba bez cudzysłowów, np. 35.00 a nie "35.00"',
    method: 'POST',
    expectedStatus: 201,
    validate(result: RequestResult, body?: string) {
      if (result.status === 422) {
        const data = result.data as any
        return { passed: false, message: `Błąd walidacji: ${data?.error || 'sprawdź typy danych'}` }
      }
      if (result.status === 400) {
        const data = result.data as any
        return { passed: false, message: `Brakuje pól: ${data?.missing?.join(', ') || 'sprawdź body'}` }
      }
      if (result.status !== 201) return { passed: false, message: `Oczekiwano statusu 201 Created, dostałeś ${result.status}` }
      const data = result.data as any
      if (!data?.id) return { passed: false, message: 'Serwer nie zwrócił ID nowego produktu' }
      return { passed: true, message: `Produkt "${data.name}" dodany! Serwer nadał mu ID: ${data.id}` }
    },
  },
  {
    id: 'ex4',
    number: 4,
    title: 'Zaktualizuj cenę Słuchawek',
    description:
      'Użyj metody PUT żeby zmienić cenę Słuchawek na 179.99. PUT wymaga podania WSZYSTKICH pól w body — nie tylko tych które zmieniasz.',
    hint: 'Wszystkie pola: name, price, category, stock. ID Słuchawek wstaw w URL.',
    method: 'PUT',
    expectedStatus: 200,
    validate(result: RequestResult) {
      if (result.status === 404) return { passed: false, message: 'Produkt nie znaleziony — sprawdź ID w URL' }
      if (result.status === 400) {
        const data = result.data as any
        return { passed: false, message: `Brakuje pól w body: ${data?.missing?.join(', ')}` }
      }
      if (!result.ok) return { passed: false, message: `Oczekiwano statusu 200, dostałeś ${result.status}` }
      const data = result.data as any
      if (data?.price !== 179.99) return { passed: false, message: `Cena powinna wynosić 179.99, a wynosi ${data?.price}` }
      return { passed: true, message: `Zaktualizowano! Nowa cena Słuchawek: ${data.price} zł.` }
    },
  },
]
