import { ProfileComponent } from './profile/profile';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProfileComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
