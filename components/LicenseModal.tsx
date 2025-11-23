import React, { useEffect, useState } from 'react';
import { CloseIcon } from './icons';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LicenseInfo = [
  {
    name: '@google/genai',
    url: 'https://github.com/google/generative-ai-js',
    licenseName: 'Apache License 2.0',
    licenseText: `
Copyright 2024 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
    `.trim(),
  },
   {
    name: '@vitejs/plugin-react',
    url: 'https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react',
    licenseName: 'MIT License',
    licenseText: `
MIT License

Copyright (c) 2020-present, Yuxi (Evan) You and Vite contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
    `.trim(),
  },
  {
    name: 'Marked',
    url: 'https://github.com/markedjs/marked',
    licenseName: 'MIT License',
    licenseText: `
The MIT License (MIT)

Copyright (c) 2011-2024, Christopher Jeffrey. (MIT Licensed)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
    `.trim(),
  },
   {
    name: 'Node.js',
    url: 'https://github.com/nodejs/node',
    licenseName: 'MIT License',
    licenseText: `
Copyright Node.js contributors. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
    `.trim(),
  },
  {
    name: 'React, React-DOM & Types',
    url: 'https://github.com/facebook/react',
    licenseName: 'MIT License',
    licenseText: `
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
    `.trim(),
  },
  {
    name: 'Tailwind CSS',
    url: 'https://github.com/tailwindlabs/tailwindcss',
    licenseName: 'MIT License',
    licenseText: `
MIT License

Copyright (c) Tailwind Labs, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
    `.trim(),
  },
   {
    name: 'TypeScript',
    url: 'https://github.com/microsoft/TypeScript',
    licenseName: 'Apache License 2.0',
    licenseText: `
Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.

"License" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document.
"Licensor" shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.
"Legal Entity" shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, "control" means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity.
"You" (or "Your") shall mean an individual or Legal Entity exercising permissions granted by this License.
"Source" form shall mean the preferred form for making modifications, including but not limited to software source code, documentation source, and configuration files.
"Object" form shall mean any form resulting from mechanical transformation or translation of a Source form, including but not limited to compiled object code, generated documentation, and conversions to other media types.
"Work" shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work (an example is provided in the Appendix below).
"Derivative Works" shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work and for which the editorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authorship. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work and Derivative Works thereof.
"Contribution" shall mean any work of authorship, including the original version of the Work and any modifications or additions to that Work or Derivative Works thereof, that is intentionally submitted to Licensor for inclusion in the Work by the copyright owner or by an individual or Legal Entity authorized to submit on behalf of the copyright owner. For the purposes of this definition, "submitted" means any form of electronic, verbal, or written communication sent to the Licensor or its representatives, including but not limited to communication on electronic mailing lists, source code control systems, and issue tracking systems that are managed by, or on behalf of, the Licensor for the purpose of discussing and improving the Work, but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as "Not a Contribution."
"Contributor" shall mean Licensor and any individual or Legal Entity on behalf of whom a Contribution has been received by Licensor and subsequently incorporated within the Work.

2. Grant of Copyright License.

Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.

3. Grant of Patent License.

Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable (except as stated in this section) patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims licensable by such Contributor that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted. If You institute patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated within the Work constitutes direct or contributory patent infringement, then any patent licenses granted to You under this License for that Work shall terminate as of the date such litigation is filed.

4. Redistribution.

You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:

     You must give any other recipients of the Work or Derivative Works a copy of this License; and
     You must cause any modified files to carry prominent notices stating that You changed the files; and
     You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and
     If the Work includes a "NOTICE" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file, excluding those notices that do not pertain to any part of the Derivative Works, in at least one of the following places: within a NOTICE text file distributed as part of the Derivative Works; within the Source form or documentation, if provided along with the Derivative Works; or, within a display generated by the Derivative Works, if and wherever such third-party notices normally appear. The contents of the NOTICE file are for informational purposes only and do not modify the License. You may add Your own attribution notices within Derivative Works that You distribute, alongside or as an addendum to the NOTICE text from the Work, provided that such additional attribution notices cannot be construed as modifying the License.

You may add Your own copyright statement to Your modifications and may provide additional or different license terms and conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, provided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this License.

5. Submission of Contributions.

Unless You explicitly state otherwise, any Contribution intentionally submitted for inclusion in the Work by You to the Licensor shall be under the terms and conditions of this License, without any additional terms or conditions. Notwithstanding the above, nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with Licensor regarding such Contributions.

6. Trademarks.

This License does not grant permission to use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file.

7. Disclaimer of Warranty.

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.

8. Limitation of Liability.

In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, shall any Contributor be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work (including but not limited to damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses), even if such Contributor has been advised of the possibility of such damages.

9. Accepting Warranty or Additional Liability.

While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in accepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of any other Contributor, and only if You agree to indemnify, defend, and hold each Contributor harmless for any liability incurred by, or claims asserted against, such Contributor by reason of your accepting any such warranty or additional liability.

END OF TERMS AND CONDITIONS
    `.trim(),
  },
  {
    name: 'Vite',
    url: 'https://github.com/vitejs/vite',
    licenseName: 'MIT License',
    licenseText: `
MIT License

Copyright (c) 2019-present, Yuxi (Evan) You and Vite contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
    `.trim(),
  },
].sort((a, b) => a.name.localeCompare(b.name));

const AppLicense = {
    name: 'NumiScanAI',
    licenseName: {
        pl: 'Licencja komercyjna',
        en: 'Commercial License',
        es: 'Licencia Comercial',
    },
    licenseText: {
        pl: `
Copyright (c) 2024 NumiScanAI

Oprogramowanie oraz powiązane pliki dokumentacji (dalej „Oprogramowanie”) są chronione prawem autorskim. Autorem i wyłącznym właścicielem praw własności intelektualnej do Oprogramowania jest NumiScanAI.

1. Zakres licencji
Użytkownikowi udziela się ograniczonej, niewyłącznej, nieprzenoszalnej licencji na korzystanie z Oprogramowania wyłącznie w celach komercyjnych, zgodnie z warunkami niniejszej licencji.

2. Ograniczenia
Zabrania się:
- kopiowania, rozpowszechniania, publikowania, udostępniania, sprzedaży lub sublicencjonowania Oprogramowania w całości lub w części,
- modyfikowania, dekompilowania, odtwarzania kodu źródłowego, łączenia z innym oprogramowaniem lub tworzenia dzieł pochodnych,
- usuwania lub zmieniania informacji o prawach autorskich, znakach towarowych lub innych oznaczeniach własności.

3. Własność intelektualna
Wszelkie prawa, tytuły i udziały w Oprogramowaniu, w tym prawa autorskie, prawa własności przemysłowej oraz know-how, pozostają wyłączną własnością NumiScanAI. Licencja nie przenosi żadnych praw własności na użytkownika.

4. Gwarancja i odpowiedzialność
OPROGRAMOWANIE JEST DOSTARCZANE „TAK JAK JEST”, BEZ JAKIEJKOLWIEK GWARANCJI, WYRAŹNEJ LUB DOROZUMIANEJ, W TYM MIĘDZY INNYMI GWARANCJI PRZYDATNOŚCI HANDLOWEJ, PRZYDATNOŚCI DO OKREŚLONEGO CELU ORAZ NIENARUSZANIA PRAW.

W ŻADNYM WYPADKU NUMISCANAI NIE PONOSI ODPOWIEDZIALNOŚCI ZA JAKIEKOLWIEK SZKODY BEZPOŚREDNIE, POŚREDNIE, UBOCZNE, WTÓRNE LUB SZCZEGÓLNE, WYNIKAJĄCE Z KORZYSTANIA Z OPROGRAMOWANIA.
        `.trim(),
        en: `
Copyright (c) 2024 NumiScanAI

The software and associated documentation files (hereinafter "the Software") are protected by copyright. The author and exclusive owner of the intellectual property rights to the Software is NumiScanAI.

1. License Scope
The user is granted a limited, non-exclusive, non-transferable license to use the Software solely for commercial purposes, in accordance with the terms of this license.

2. Restrictions
It is prohibited to:
- copy, distribute, publish, share, sell, or sublicense the Software in whole or in part,
- modify, decompile, reverse engineer, merge with other software, or create derivative works,
- remove or alter copyright notices, trademarks, or other proprietary markings.

3. Intellectual Property
All rights, titles, and interests in the Software, including copyrights, industrial property rights, and know-how, remain the exclusive property of NumiScanAI. This license does not transfer any ownership rights to the user.

4. Warranty and Liability
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT ANY WARRANTY, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.

IN NO EVENT SHALL NUMISCANAI BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES ARISING FROM THE USE OF THE SOFTWARE.
        `.trim(),
        es: `
Copyright (c) 2024 NumiScanAI

El software y los archivos de documentación asociados (en adelante, "el Software") están protegidos por derechos de autor. El autor y propietario exclusivo de los derechos de propiedad intelectual del Software es NumiScanAI.

1. Alcance de la Licencia
Se concede al usuario una licencia limitada, no exclusiva e intransferible para utilizar el Software únicamente con fines comerciales, de acuerdo con los términos de esta licencia.

2. Restricciones
Se prohíbe:
- copiar, distribuir, publicar, compartir, vender o sublicenciar el Software, total o parcialmente,
- modificar, descompilar, aplicar ingeniería inversa, combinar con otro software o crear obras derivadas,
- eliminar o alterar los avisos de derechos de autor, marcas comerciales u otras marcas de propiedad.

3. Propiedad Intelectual
Todos los derechos, títulos e intereses sobre el Software, incluidos los derechos de autor, los derechos de propiedad industrial y el know-how, siguen siendo propiedad exclusiva de NumiScanAI. Esta licencia no transfiere ningún derecho de propiedad al usuario.

4. Garantía y Responsabilidad
EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN NINGUNA GARANTÍA, EXPRESA O IMPLÍCITA, INCLUYENDO, ENTRE OTRAS, LAS GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN.

EN NINGÚN CASO NUMISCANAI SERÁ RESPONSABLE DE NINGÚN DAÑO DIRECTO, INDIRECTO, INCIDENTAL, ESPECIAL, EJEMPLAR O CONSECUENTE QUE SURJA DEL USO DEL SOFTWARE.
        `.trim(),
    },
};


export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose }) => {
  const [selectedLang, setSelectedLang] = useState<'pl' | 'en' | 'es'>('pl');
  
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEscKey);
    } else {
        document.body.style.overflow = 'auto';
    }
    return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const langButtonClasses = (lang: 'pl' | 'en' | 'es') => 
    `px-3 py-1 text-xs rounded-md transition-colors ${
      selectedLang === lang 
        ? 'bg-amber-400 text-slate-900 font-semibold' 
        : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="license-modal-title"
    >
      <div
        className="relative bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-700 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
            <h2 id="license-modal-title" className="text-lg font-bold text-amber-400">
                Licencja i Uznania
            </h2>
             <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                aria-label="Zamknij"
            >
                <CloseIcon className="w-5 h-5" />
            </button>
        </header>

        <div className="overflow-y-auto p-6 space-y-6">
            <div className="p-4 bg-slate-900/50 rounded-lg">
                <h3 className="font-semibold text-slate-100">{AppLicense.name}</h3>
                <p className="text-sm text-slate-400 mb-3">{AppLicense.licenseName[selectedLang]}</p>
                
                <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => setSelectedLang('pl')} className={langButtonClasses('pl')}>Polski</button>
                    <button onClick={() => setSelectedLang('en')} className={langButtonClasses('en')}>English</button>
                    <button onClick={() => setSelectedLang('es')} className={langButtonClasses('es')}>Español</button>
                </div>

                <pre className="text-xs text-slate-500 bg-slate-900 p-2 rounded whitespace-pre-wrap font-mono">{AppLicense.licenseText[selectedLang]}</pre>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-200 mb-2">Środowisko uruchomieniowe i wersje bibliotek</h3>
              <div className="p-4 bg-slate-900/50 rounded-lg text-sm text-slate-400 space-y-3">
                 <p>
                    Aplikacja została przetestowana i jest dostarczana do działania z konkretnymi wersjami bibliotek open-source, które są wymienione w sekcji "Uznania".
                 </p>
                 <p>
                    Aby uniknąć potencjalnych problemów z kompatybilnością, wersje tych bibliotek zostały "zamrożone" w plikach konfiguracyjnych. Użytkownik ponosi odpowiedzialność za przygotowanie i utrzymanie odpowiedniego środowiska uruchomieniowego, zgodnego z wymaganiami technologicznymi aplikacji. Twórca nie gwarantuje poprawnego działania aplikacji w przypadku użycia innych wersji bibliotek lub w niekompatybilnym środowisku.
                 </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-base font-semibold text-slate-200 mb-2">Klauzula dotycząca danych i odpowiedzialności</h3>
              <div className="p-4 bg-slate-900/50 rounded-lg text-sm text-slate-400 space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-300 mb-2">Sposób działania aplikacji</h4>
                  <p>
                    NumiScanAI wykorzystuje zaawansowany model sztucznej inteligencji (Gemini) zintegrowany z wyszukiwarką Google do analizy przesłanych zdjęć. Aplikacja nie pobiera danych bezpośrednio (nie „scrapuje”) z żadnych konkretnych serwisów. Model AI przeszukuje publicznie dostępny internet, aby zidentyfikować przedmiot i zebrać informacje, które następnie syntetyzuje w formie analizy. Dla pełnej transparentności, źródła internetowe wykorzystane przez AI są wymienione na dole każdego raportu.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-300 mb-2">Prawa autorskie i odpowiedzialność użytkownika (EULA)</h4>
                  <p>
                    Użytkownik przyjmuje do wiadomości, że informacje i treści (opisy, zdjęcia, dane katalogowe) dostępne w zewnętrznych serwisach numizmatycznych (takich jak uCoin, Numista i inne) są chronione prawem autorskim i stanowią własność intelektualną ich autorów.
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-2 mt-2">
                    <li>NumiScanAI nie rości sobie żadnych praw do treści pochodzących z zewnętrznych źródeł.</li>
                    <li>Użytkownik ponosi pełną odpowiedzialność za dalsze wykorzystanie wygenerowanej analizy. Korzystanie z wyników w sposób naruszający prawa autorskie lub regulaminy serwisów źródłowych jest zabronione.</li>
                    <li>W przypadku komercyjnego wykorzystania danych, użytkownik jest zobowiązany do uzyskania odpowiedniej licencji lub zgody bezpośrednio od właścicieli praw autorskich (np. od administracji serwisu uCoin/Numista).</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-300 mb-2">Wyłączenie odpowiedzialności</h4>
                  <p>
                    Analizy generowane przez NumiScanAI są dostarczane na zasadzie „tak jak jest” (as is) i mają charakter wyłącznie informacyjny. Twórca aplikacji nie ponosi odpowiedzialności za dokładność, kompletność ani przydatność uzyskanych informacji. Twórca nie ponosi również odpowiedzialności za jakiekolwiek roszczenia stron trzecich wynikające z niewłaściwego lub nielegalnego wykorzystania danych przez użytkownika końcowego.
                  </p>
                </div>
              </div>
            </div>

            <div>
                <h3 className="text-base font-semibold text-slate-200 mb-2">Biblioteki i oprogramowanie stron trzecich</h3>
                <p className="text-sm text-slate-400 mb-4">Ta aplikacja została stworzona przy użyciu następujących wspaniałych projektów open-source:</p>
                <div className="space-y-4">
                    {LicenseInfo.map(lib => (
                        <details key={lib.name} className="bg-slate-900/50 rounded-lg group">
                            <summary className="p-3 cursor-pointer font-medium text-slate-300 hover:bg-slate-700/30 rounded-t-lg list-none flex justify-between items-center">
                                <span>{lib.name} - <em className="text-slate-400">{lib.licenseName}</em></span>
                                <span className="text-xs text-amber-400 group-open:rotate-90 transition-transform">▶</span>
                            </summary>
                            <div className="p-3 border-t border-slate-700">
                                <a href={lib.url} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 text-sm mb-2 block hover:underline">
                                    Odwiedź repozytorium
                                </a>
                                <pre className="text-xs text-slate-500 bg-slate-900 p-2 rounded whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">{lib.licenseText}</pre>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </div>
        
         <footer className="p-4 border-t border-slate-700 flex-shrink-0 text-right">
             <button
                onClick={onClose}
                className="py-2 px-4 bg-slate-700/70 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
            >
                Zamknij
            </button>
         </footer>
      </div>
    </div>
  );
};
