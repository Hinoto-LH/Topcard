import { Component, inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
import { RouterLink } from '@angular/router'
import { LayoutService } from '../../services/layout'

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy, AfterViewInit {
  private layout = inject(LayoutService)

  ngOnInit()    { this.layout.showNav.set(false) }
  ngOnDestroy() { this.layout.showNav.set(true) }

  ngAfterViewInit() {
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    reveals.forEach(el => observer.observe(el))
  }
}
